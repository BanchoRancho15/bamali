import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { VenueSearchParams } from '@/types'

// GET /api/venues - search and list venues
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = req.nextUrl

    const params: VenueSearchParams = {
      q: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      venue_type: searchParams.get('venue_type') as any || undefined,
      capacity: searchParams.get('capacity') ? parseInt(searchParams.get('capacity')!) : undefined,
      min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!) : undefined,
      date: searchParams.get('date') || undefined,
      sort: searchParams.get('sort') as any || 'rating',
    }

    let query = supabase
      .from('venues')
      .select('*, owner:profiles!owner_id(full_name, avatar_url, is_verified)')
      .eq('is_active', true)

    if (params.q) {
      query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%,city.ilike.%${params.q}%`)
    }
    if (params.city) query = query.eq('city', params.city)
    if (params.venue_type) query = query.eq('venue_type', params.venue_type)
    if (params.capacity) query = query.gte('capacity_max', params.capacity)
    if (params.min_price) query = query.gte('price_per_evening', params.min_price)
    if (params.max_price) query = query.lte('price_per_evening', params.max_price)

    // If date filter, exclude venues with existing bookings
    if (params.date) {
      const { data: bookedVenueIds } = await supabase
        .from('bookings')
        .select('venue_id')
        .eq('event_date', params.date)
        .in('status', ['pending', 'confirmed'])

      const bookedIds = bookedVenueIds?.map(b => b.venue_id) || []
      if (bookedIds.length > 0) {
        query = query.not('id', 'in', `(${bookedIds.join(',')})`)
      }
    }

    // Sort
    switch (params.sort) {
      case 'price_asc': query = query.order('price_per_evening', { ascending: true }); break
      case 'price_desc': query = query.order('price_per_evening', { ascending: false }); break
      case 'newest': query = query.order('created_at', { ascending: false }); break
      default: query = query.order('rating', { ascending: false })
    }

    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '12')
    query = query.range((page - 1) * perPage, page * perPage - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ venues: data, total: count, page, perPage })
  } catch (err: any) {
    console.error('[GET /api/venues]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/venues - create a new venue (venue_owner only)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    // Validate user is venue_owner
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || !['venue_owner', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Only venue owners can create venues' }, { status: 403 })
    }

    // Generate slug
    const slug = body.name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const { data, error } = await supabase
      .from('venues')
      .insert({ ...body, owner_id: user.id, slug })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ venue: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

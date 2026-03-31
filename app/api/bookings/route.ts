import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { calculateTotal } from '@/lib/utils'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

// GET /api/bookings - get user bookings
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        venue:venues(id, name, slug, main_image, city, venue_type),
        equipment_items:booking_equipment(*, equipment:equipment(*))
      `)
      .eq('organizer_id', user.id)
      .order('event_date', { ascending: false })

    if (error) throw error
    return NextResponse.json({ bookings: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/bookings - create booking + Stripe checkout
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      venue_id, event_name, event_description, event_type,
      expected_guests, event_date, start_time, end_time,
      equipment_ids = [], notes
    } = body

    // 1. Get venue
    const { data: venue, error: venueErr } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venue_id)
      .single()
    if (venueErr || !venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 })

    // 2. Check availability
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('venue_id', venue_id)
      .eq('event_date', event_date)
      .in('status', ['pending', 'confirmed'])
      .single()
    if (existingBooking) return NextResponse.json({ error: 'Venue not available on this date' }, { status: 409 })

    // 3. Get equipment prices
    let equipmentTotal = 0
    const equipmentItems: { equipment_id: string; unit_price: number; total_price: number; quantity: number }[] = []

    if (equipment_ids.length > 0) {
      const { data: equipmentList } = await supabase
        .from('equipment')
        .select('id, price, name')
        .in('id', equipment_ids)

      equipmentList?.forEach(eq => {
        equipmentTotal += eq.price
        equipmentItems.push({ equipment_id: eq.id, unit_price: eq.price, total_price: eq.price, quantity: 1 })
      })
    }

    // 4. Calculate total
    const { platformFee, total } = calculateTotal(venue.price_per_evening, equipmentTotal)

    // 5. Create booking (pending payment)
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        organizer_id: user.id,
        venue_id,
        event_name,
        event_description,
        event_type,
        expected_guests,
        event_date,
        start_time,
        end_time,
        venue_price: venue.price_per_evening,
        equipment_total: equipmentTotal,
        platform_fee: platformFee,
        total_amount: total,
        notes,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (bookingErr) throw bookingErr

    // 6. Add equipment items
    if (equipmentItems.length > 0) {
      await supabase.from('booking_equipment').insert(
        equipmentItems.map(item => ({ ...item, booking_id: booking.id, status: 'pending' }))
      )
    }

    // 7. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ils',
            product_data: {
              name: `${venue.name} - ${event_name}`,
              description: `${event_date} | ${expected_guests || '?'} אורחים`,
            },
            unit_amount: total * 100, // Stripe uses agorot
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/venues/${venue.slug}?cancelled=1`,
      metadata: { booking_id: booking.id, venue_id, organizer_id: user.id },
      customer_email: user.email,
    })

    // 8. Update booking with session ID
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)

    return NextResponse.json({
      booking,
      checkout_url: session.url,
    }, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/bookings]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

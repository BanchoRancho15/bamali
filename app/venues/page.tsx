import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'
import { VenueCard } from '@/components/venue/VenueCard'
import { VenueFilters } from '@/components/venue/VenueFilters'
import { VENUE_TYPES, CITIES } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'מקומות לאירועים',
  description: 'חפש מקום מושלם לאירוע שלך - גלריות, סטודיואים, בתי קפה, גגות ועוד ברחבי ישראל',
}

interface Props {
  searchParams: {
    q?: string
    city?: string
    venue_type?: string
    capacity?: string
    min_price?: string
    max_price?: string
    sort?: string
    page?: string
  }
}

export default async function VenuesPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('venues')
    .select('*, owner:profiles!owner_id(full_name, avatar_url, is_verified)', { count: 'exact' })
    .eq('is_active', true)

  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%,neighborhood.ilike.%${searchParams.q}%`)
  }
  if (searchParams.city) query = query.eq('city', searchParams.city)
  if (searchParams.venue_type) query = query.eq('venue_type', searchParams.venue_type)
  if (searchParams.capacity) query = query.gte('capacity_max', parseInt(searchParams.capacity))
  if (searchParams.min_price) query = query.gte('price_per_evening', parseInt(searchParams.min_price))
  if (searchParams.max_price) query = query.lte('price_per_evening', parseInt(searchParams.max_price))

  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    rating: { column: 'rating', ascending: false },
    price_asc: { column: 'price_per_evening', ascending: true },
    price_desc: { column: 'price_per_evening', ascending: false },
    newest: { column: 'created_at', ascending: false },
  }
  const sort = sortMap[searchParams.sort || 'rating'] || sortMap.rating
  query = query.order(sort.column, { ascending: sort.ascending })

  const page = parseInt(searchParams.page || '1')
  const perPage = 12
  query = query.range((page - 1) * perPage, page * perPage - 1)

  const { data: venues, count } = await query

  const totalPages = Math.ceil((count || 0) / perPage)
  const activeFilters = Object.values(searchParams).filter(Boolean).length

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {searchParams.q ? `תוצאות עבור "${searchParams.q}"` : 'כל המקומות'}
          </h1>
          <p className="text-gray-500">
            {count !== null ? `${count} מקומות נמצאו` : 'טוען...'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-72 shrink-0">
            <VenueFilters
              currentParams={searchParams}
              cities={CITIES}
              venueTypes={Object.entries(VENUE_TYPES).map(([value, label]) => ({ value, label }))}
            />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {venues && venues.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map(venue => (
                  <VenueCard key={venue.id} venue={venue as any} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">לא נמצאו מקומות</h3>
                <p className="text-gray-500">נסה לשנות את פרמטרי החיפוש</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <a
                    key={p}
                    href={`?${new URLSearchParams({ ...searchParams, page: p.toString() })}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                      p === page
                        ? 'bg-primary-700 text-white'
                        : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 shadow-sm'
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

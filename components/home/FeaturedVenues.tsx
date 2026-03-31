import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { VenueCard } from '@/components/venue/VenueCard'
import type { Venue } from '@/types'

interface FeaturedVenuesProps {
  venues: Venue[]
}

export function FeaturedVenues({ venues }: FeaturedVenuesProps) {
  if (!venues.length) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">🏆 מקומות מובילים</h2>
            <p className="text-gray-500 text-lg">המקומות הפופולריים ביותר בפלטפורמה</p>
          </div>
          <Link
            href="/venues"
            className="hidden md:flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors group"
          >
            כל המקומות
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link href="/venues" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-50 text-primary-700 font-semibold">
            כל המקומות <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Star, CheckCircle } from 'lucide-react'
import { formatPrice, VENUE_TYPES, AMENITIES } from '@/lib/utils'
import type { Venue } from '@/types'

const VENUE_EMOJIS: Record<string, string> = {
  gallery: '🎨', studio: '🎭', cafe: '☕', rooftop: '🌆',
  club: '🎵', hall: '🏛️', outdoor: '🌿', other: '📍',
}
const VENUE_COLORS: Record<string, string> = {
  gallery: 'bg-blue-50', studio: 'bg-yellow-50', cafe: 'bg-pink-50', rooftop: 'bg-purple-50',
  club: 'bg-red-50', hall: 'bg-green-50', outdoor: 'bg-emerald-50', other: 'bg-gray-50',
}

interface VenueCardProps {
  venue: Venue & { owner?: { full_name: string; is_verified: boolean } }
  compact?: boolean
}

export function VenueCard({ venue, compact = false }: VenueCardProps) {
  return (
    <Link href={`/venues/${venue.slug}`} className="block group">
      <article className="bg-white rounded-2xl shadow-card hover:shadow-card-xl transition-all duration-300 overflow-hidden card-hover">

        {/* Image / Emoji fallback */}
        <div className={`relative h-48 overflow-hidden ${VENUE_COLORS[venue.venue_type] || 'bg-gray-50'}`}>
          {venue.main_image ? (
            <Image
              src={venue.main_image}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-7xl">{VENUE_EMOJIS[venue.venue_type] || '📍'}</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {venue.is_featured && (
              <span className="bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                ⭐ מומלץ
              </span>
            )}
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              זמין
            </span>
          </div>

          {/* Price badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-xl">
              {formatPrice(venue.price_per_evening)} / ערב
            </span>
          </div>

          {/* Type badge */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-white/90 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">
              {VENUE_TYPES[venue.venue_type]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary-700 transition-colors">
              {venue.name}
            </h3>
            {venue.rating > 0 && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star size={14} className="fill-accent-500 text-accent-500" />
                <span className="font-bold text-gray-800">{venue.rating.toFixed(1)}</span>
                <span className="text-gray-400">({venue.total_reviews})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <MapPin size={14} />
            <span>{venue.neighborhood ? `${venue.neighborhood}, ` : ''}{venue.city}</span>
            <span className="text-gray-300 mx-1">·</span>
            <Users size={14} />
            <span>עד {venue.capacity_max} איש</span>
          </div>

          {!compact && venue.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
              {venue.description}
            </p>
          )}

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5">
            {venue.amenities.slice(0, 3).map(key => {
              const amenity = AMENITIES[key]
              return amenity ? (
                <span key={key} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg font-medium">
                  {amenity.icon} {amenity.label}
                </span>
              ) : null
            })}
            {venue.amenities.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                +{venue.amenities.length - 3}
              </span>
            )}
          </div>

          {/* Owner */}
          {venue.owner && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700">
                {venue.owner.full_name.charAt(0)}
              </div>
              <span className="text-xs text-gray-500">{venue.owner.full_name}</span>
              {venue.owner.is_verified && (
                <CheckCircle size={14} className="text-emerald-500 mr-auto" />
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

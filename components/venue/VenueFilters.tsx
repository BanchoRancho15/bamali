'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { AMENITIES } from '@/lib/utils'

interface VenueFiltersProps {
  currentParams: Record<string, string | undefined>
  cities: string[]
  venueTypes: { value: string; label: string }[]
}

export function VenueFilters({ currentParams, cities, venueTypes }: VenueFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [params, setParams] = useState({ ...currentParams })

  const applyFilters = () => {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== ''))
    router.push(`${pathname}?${new URLSearchParams(clean as any)}`)
  }

  const reset = () => {
    setParams({})
    router.push(pathname)
  }

  const update = (key: string, value: string) => setParams(p => ({ ...p, [key]: value }))

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <SlidersHorizontal size={18} />
          פילטרים
        </div>
        <button onClick={reset} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
          <RotateCcw size={12} /> איפוס
        </button>
      </div>

      <div className="space-y-5">
        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">מיון לפי</label>
          <select
            value={params.sort || 'rating'}
            onChange={e => update('sort', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="rating">דירוג גבוה ביותר</option>
            <option value="price_asc">מחיר: מהנמוך לגבוה</option>
            <option value="price_desc">מחיר: מהגבוה לנמוך</option>
            <option value="newest">הכי חדש</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">עיר</label>
          <select
            value={params.city || ''}
            onChange={e => update('city', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">כל הערים</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Venue type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">סוג מקום</label>
          <div className="grid grid-cols-2 gap-2">
            {venueTypes.map(t => (
              <button
                key={t.value}
                onClick={() => update('venue_type', params.venue_type === t.value ? '' : t.value)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border-2 transition-colors ${
                  params.venue_type === t.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">קיבולת מינימלית</label>
          <select
            value={params.capacity || ''}
            onChange={e => update('capacity', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">כל הגדלים</option>
            <option value="20">20+ איש</option>
            <option value="50">50+ איש</option>
            <option value="100">100+ איש</option>
            <option value="200">200+ איש</option>
          </select>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">טווח מחירים (₪)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="מינ'"
              value={params.min_price || ''}
              onChange={e => update('min_price', e.target.value)}
              className="w-1/2 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="מקס'"
              value={params.max_price || ''}
              onChange={e => update('max_price', e.target.value)}
              className="w-1/2 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 text-white font-semibold text-sm transition-all hover:shadow-primary"
        >
          הצג תוצאות
        </button>
      </div>
    </div>
  )
}

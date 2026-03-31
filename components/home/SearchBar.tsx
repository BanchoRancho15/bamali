'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Users, Calendar } from 'lucide-react'
import { CITIES } from '@/lib/utils'

export function SearchBar() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [guests, setGuests] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    if (guests) params.set('capacity', guests)
    router.push(`/venues?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-3xl shadow-card-xl border border-gray-100 p-6 -mt-10 relative z-20">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 חפש מקום לאירוע שלך</h2>
      <div className="flex flex-col md:flex-row gap-3">

        {/* Keyword search */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute top-3.5 right-4 text-gray-400" />
          <input
            type="text"
            placeholder="שם מקום, סוג אירוע..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm font-medium"
          />
        </div>

        {/* City */}
        <div className="relative">
          <MapPin size={18} className="absolute top-3.5 right-4 text-gray-400 pointer-events-none" />
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="pr-11 pl-10 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm font-medium bg-white appearance-none min-w-[160px]"
          >
            <option value="">כל הערים</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Guests */}
        <div className="relative">
          <Users size={18} className="absolute top-3.5 right-4 text-gray-400 pointer-events-none" />
          <select
            value={guests}
            onChange={e => setGuests(e.target.value)}
            className="pr-11 pl-10 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm font-medium bg-white appearance-none min-w-[150px]"
          >
            <option value="">מספר אורחים</option>
            <option value="30">עד 30</option>
            <option value="60">עד 60</option>
            <option value="100">עד 100</option>
            <option value="200">עד 200</option>
            <option value="500">עד 500</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 text-white font-bold shadow-primary hover:shadow-primary-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
        >
          חיפוש
        </button>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'דשבורד' }

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, venue:venues(name, slug, city, venue_type, main_image)')
    .eq('organizer_id', user.id)
    .order('event_date', { ascending: false })
    .limit(10)

  const stats = {
    upcoming: bookings?.filter(b => b.status === 'confirmed' && new Date(b.event_date) >= new Date()).length || 0,
    completed: bookings?.filter(b => b.status === 'completed').length || 0,
    totalSpent: bookings?.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0) || 0,
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">👋 שלום, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-1">הנה מה שקורה בחשבון שלך</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'אירועים קרובים', value: stats.upcoming, icon: '📅' },
            { label: 'אירועים שהתקיימו', value: stats.completed, icon: '✅' },
            { label: 'הזמנות פעילות', value: bookings?.filter(b => b.status !== 'cancelled').length || 0, icon: '🎫' },
            { label: 'סה"כ הוצאות', value: `₪${stats.totalSpent.toLocaleString('he-IL')}`, icon: '💰' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-primary-700">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a href="/venues" className="bg-gradient-to-br from-primary-700 to-primary-500 text-white rounded-2xl p-5 hover:shadow-primary transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-bold">חפש מקום לאירוע</div>
            <div className="text-primary-200 text-sm mt-1">גלה מקומות חדשים</div>
          </a>
          <a href="/equipment" className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">🛠️</div>
            <div className="font-bold text-gray-900">הוסף ציוד לאירוע</div>
            <div className="text-gray-500 text-sm mt-1">הגברה, תאורה, צילום ועוד</div>
          </a>
          <a href="/dashboard/messages" className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-lg transition-all hover:-translate-y-1">
            <div className="text-3xl mb-2">💬</div>
            <div className="font-bold text-gray-900">הודעות</div>
            <div className="text-gray-500 text-sm mt-1">תקשורת עם בעלי מקומות</div>
          </a>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">📋 ההזמנות שלי</h2>
            <a href="/dashboard/bookings" className="text-primary-700 text-sm font-semibold hover:underline">הכל</a>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {bookings.map(booking => (
                <div key={booking.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-gray-900">{booking.event_name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      📍 {(booking.venue as any)?.name} · 📅 {new Date(booking.event_date).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                      booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {{
                        confirmed: '✅ מאושר',
                        pending: '⏳ ממתין',
                        cancelled: '❌ בוטל',
                        completed: '🏆 הושלם',
                        refunded: '💸 הוחזר',
                      }[booking.status] || booking.status}
                    </span>
                    <span className="font-bold text-primary-700">₪{booking.total_amount.toLocaleString('he-IL')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎪</div>
              <h3 className="font-bold text-gray-800 mb-2">עדיין אין הזמנות</h3>
              <p className="text-gray-500 text-sm mb-6">מצא מקום מושלם לאירוע הראשון שלך</p>
              <a href="/venues" className="inline-flex px-6 py-2.5 rounded-xl bg-primary-700 text-white font-semibold text-sm hover:bg-primary-800 transition-colors">
                חפש מקום
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

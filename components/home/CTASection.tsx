import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="text-5xl mb-6">🎪</div>
            <h2 className="text-4xl font-black mb-4">מוכנים לעלות לבמה?</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-xl mx-auto">
              הצטרפו לאלפי מרצים, יזמים ובעלי מקומות שכבר משתמשים בבמה לי
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/venues"
                className="px-8 py-4 rounded-2xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                🔍 חפש מקום עכשיו
              </Link>
              <Link
                href="/auth/register?role=venue_owner"
                className="px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-lg backdrop-blur-sm border border-white/30 transition-all duration-300"
              >
                🏠 רשום את המקום שלך
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

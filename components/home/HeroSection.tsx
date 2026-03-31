import Link from 'next/link'
import { ArrowLeft, Star, Shield, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 px-5 py-2.5 rounded-full text-sm font-semibold text-primary-700 shadow-sm mb-8">
            <Zap size={14} className="text-accent-500" />
            הפלטפורמה הראשונה בישראל לתיווך אירועים
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            <span className="gradient-text">הבמה שלך</span>
            <br />
            <span className="text-gray-800">מחכה לך</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
            מחברים מרצים, יזמים ואמנים עם מקומות מדהימים ברחבי ישראל.
            <br />
            <strong className="text-gray-800">מקום + ציוד + הפקה — הכל בלחיצת כפתור</strong>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/venues"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-primary-700 to-primary-500 shadow-primary hover:shadow-primary-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              🔍 מצא מקום לאירוע
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/register?role=venue_owner"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-primary-700 bg-white border-2 border-primary-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300"
            >
              🏠 רשום את המקום שלך
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Shield size={16} className="text-emerald-500" />
              <span>תשלום מאובטח</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={16} className="text-accent-500 fill-accent-500" />
              <span>דירוג ממוצע 4.8/5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>ביטול חינם 48 שעות</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🎯</span>
              <span>התאמה בעזרת AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

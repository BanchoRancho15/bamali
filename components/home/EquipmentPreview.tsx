import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const EQUIPMENT_ITEMS = [
  { icon: '🔊', name: 'הגברה מקצועית', price: '₪800', desc: 'מערכת PA + מיקרופונים' },
  { icon: '💡', name: 'תאורת במה', price: '₪600', desc: 'ספוטים + אווירה' },
  { icon: '📹', name: 'צילום וידאו', price: '₪1,200', desc: '2 מצלמות + עריכה' },
  { icon: '📸', name: 'צלם אירועים', price: '₪900', desc: 'גלריה דיגיטלית' },
  { icon: '📽️', name: 'מסך ומקרן', price: '₪400', desc: 'HD + 3 מטר' },
  { icon: '📡', name: 'שידור חי', price: '₪700', desc: 'סטרימינג + הקלטה' },
  { icon: '🍷', name: 'קייטרינג קל', price: '₪1,500', desc: 'כיבוד + משקאות' },
  { icon: '🎨', name: 'עיצוב גרפי', price: '₪500', desc: 'פוסטר + הזמנה' },
]

export function EquipmentPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">🛠️ ציוד ושירותים</h2>
            <p className="text-gray-500 text-lg">הוסף כל מה שצריך לאירוע מושלם</p>
          </div>
          <Link href="/equipment" className="hidden md:flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 group">
            כל השירותים <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {EQUIPMENT_ITEMS.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-lg hover:border-primary-200 border-2 border-transparent transition-all duration-300 text-center cursor-pointer group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
              <p className="text-gray-400 text-xs mb-2">{item.desc}</p>
              <div className="text-primary-700 font-black text-lg">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

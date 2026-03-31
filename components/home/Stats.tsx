const STATS = [
  { value: '150+', label: 'מקומות ברחבי הארץ', icon: '🏛️' },
  { value: '2,400+', label: 'אירועים שהתקיימו', icon: '🎉' },
  { value: '98%', label: 'שביעות רצון', icon: '⭐' },
  { value: '0₪', label: 'עמלת רישום', icon: '🎁' },
]

export function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-black text-primary-700 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

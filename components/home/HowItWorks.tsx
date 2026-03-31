const STEPS = [
  {
    step: 1,
    icon: '📝',
    title: 'ספר על האירוע',
    desc: 'הגדר סוג אירוע, מספר משתתפים, תאריך ותקציב. תהליך של 2 דקות.',
  },
  {
    step: 2,
    icon: '🤖',
    title: 'קבל התאמות חכמות',
    desc: 'מנוע ה-AI שלנו ימצא את המקומות המושלמים עבורך מתוך מאות אפשרויות.',
  },
  {
    step: 3,
    icon: '🛒',
    title: 'הוסף ציוד ושירותים',
    desc: 'הגברה, תאורה, צלם, שידור חי ועוד — הכל זמין בלחיצה, בתוספת לאירוע.',
  },
  {
    step: 4,
    icon: '🎉',
    title: 'הזמן ותהנה',
    desc: 'אשר, שלם ואנחנו נדאג לכל הקואורדינציה. רק תגיע לאירוע.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-900 mb-4">איך זה עובד?</h2>
          <p className="text-xl text-gray-500">4 צעדים פשוטים מהרעיון לבמה</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-10 right-[12.5%] left-[12.5%] h-0.5 bg-gradient-to-l from-primary-300 to-accent-400 z-0" />

          {STEPS.map((step, i) => (
            <div key={i} className="relative z-10 text-center group">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-500 text-white flex items-center justify-center text-3xl shadow-primary group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="w-7 h-7 bg-white border-2 border-primary-300 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 mx-auto mb-3">
                {step.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

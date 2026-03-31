import Link from 'next/link'

const LINKS = {
  platform: [
    { href: '/venues', label: 'מצא מקום' },
    { href: '/equipment', label: 'ציוד ושירותים' },
    { href: '/how-it-works', label: 'איך זה עובד?' },
    { href: '/pricing', label: 'תמחור' },
  ],
  join: [
    { href: '/auth/register?role=organizer', label: 'הצטרף כמרצה' },
    { href: '/auth/register?role=venue_owner', label: 'רשום את המקום שלך' },
    { href: '/auth/register?role=supplier', label: 'הצטרף כספק' },
  ],
  company: [
    { href: '/about', label: 'אודות' },
    { href: '/blog', label: 'בלוג' },
    { href: '/press', label: 'פרסום ומדיה' },
    { href: '/contact', label: 'צור קשר' },
  ],
  legal: [
    { href: '/terms', label: 'תנאי שימוש' },
    { href: '/privacy', label: 'מדיניות פרטיות' },
    { href: '/cookies', label: 'מדיניות עוגיות' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black mb-4">
              <span>🎪</span>
              <span className="text-white">במה לי</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              הפלטפורמה המובילה בישראל לתיווך בין מרצים ויזמים לבעלי מקומות.
            </p>
            <div className="flex gap-3 mt-4">
              {['📘','📸','🐦','💼'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors text-sm">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([key, links]) => (
            <div key={key}>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                {{ platform: 'פלטפורמה', join: 'הצטרפות', company: 'חברה', legal: 'משפטי' }[key]}
              </h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 במה לי | BamaLi. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm">🇮🇱 עברית | ILS ₪</span>
            <a href="mailto:info@bamali.co.il" className="text-gray-400 hover:text-white text-sm transition-colors">
              info@bamali.co.il
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

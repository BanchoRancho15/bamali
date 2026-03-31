import type { Metadata, Viewport } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toaster'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-heebo',
})

export const metadata: Metadata = {
  title: {
    default: 'במה לי | BamaLi - הבמה שלך מחכה לך',
    template: '%s | במה לי',
  },
  description: 'הפלטפורמה המובילה בישראל לתיווך בין מרצים ויזמים לבעלי מקומות. מצא מקום לאירוע שלך כולל ציוד, הגברה ושירותי הפקה - הכל במקום אחד.',
  keywords: ['השכרת אולמות', 'מקום לאירוע', 'הרצאות', 'סטנדאפ', 'סדנאות', 'במה לי', 'bamali'],
  authors: [{ name: 'BamaLi' }],
  creator: 'BamaLi',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://bamali.co.il',
    siteName: 'במה לי',
    title: 'במה לי - הבמה שלך מחכה לך',
    description: 'מצא מקום לאירוע שלך + ציוד + הפקה - הכל בלחיצת כפתור',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'במה לי',
    description: 'One Stop Shop לאירועים בישראל',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6C3CE1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}

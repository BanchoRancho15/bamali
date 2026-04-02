'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl shadow-card-xl p-10">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">בדוק את האימייל שלך!</h1>
          <p className="text-gray-600 text-lg mb-2">שלחנו קישור אימות ל:</p>
          {email && (
            <p className="font-bold text-primary-700 text-lg mb-6 bg-primary-50 rounded-xl px-4 py-2 inline-block">
              {decodeURIComponent(email)}
            </p>
          )}
          <p className="text-gray-500 mb-8">
            לחץ על הקישור שבאימייל כדי לאשר את החשבון שלך ולהתחיל להשתמש בפלטפורמה.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-right mb-8">
            <p className="text-amber-800 text-sm font-semibold mb-2">💡 לא קיבלת אימייל?</p>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• בדוק את תיקיית הספאם / junk</li>
              <li>• ייתכן שייקח עד 5 דקות</li>
              <li>• ודא שהכתובת שהזנת נכונה</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/auth/register" className="text-primary-700 hover:underline text-sm font-medium">← חזור לדף ההרשמה</Link>
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">חזור לדף הבית</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-2xl">⏳</div></div>}>
      <VerifyContent />
    </Suspense>
  )
}
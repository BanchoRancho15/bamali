'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { UserRole } from '@/types'

const ROLE_OPTIONS = [
  { value: 'organizer', label: '🎤 מרצה / יזם', desc: 'מחפש מקום לאירוע שלי' },
  { value: 'venue_owner', label: '🏠 בעל מקום', desc: 'רוצה למלא את המקום שלי' },
  { value: 'supplier', label: '🔧 ספק ציוד', desc: 'מציע שירותי ציוד והפקה' },
]

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') || 'organizer') as UserRole
  const supabase = createClient()

  const [role, setRole] = useState<UserRole>(defaultRole)
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.full_name, phone: formData.phone, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/auth/verify?email=' + formData.email)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black text-primary-700 mb-2 block">🎪 במה לי</Link>
          <h1 className="text-2xl font-bold text-gray-900">הצטרפות חינמית</h1>
          <p className="text-gray-500 mt-1">כבר יש לך חשבון? <Link href="/auth/login" className="text-primary-700 font-semibold hover:underline">כניסה</Link></p>
        </div>

        <div className="bg-white rounded-3xl shadow-card-xl p-8">
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">אני מצטרף בתור:</label>
            <div className="grid grid-cols-3 gap-3">
              {ROLE_OPTIONS.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value as UserRole)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all ${
                    role === r.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{r.label.split(' ')[0]}</div>
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{r.label.slice(3)}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">שם מלא</label>
              <input
                type="text" required
                value={formData.full_name}
                onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                placeholder="השם שלך"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">אימייל</label>
              <input
                type="email" required
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="you@email.com"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">טלפון</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                placeholder="050-0000000"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">סיסמה</label>
              <input
                type="password" required minLength={8}
                value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                placeholder="לפחות 8 תווים"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 text-white font-bold text-base shadow-primary hover:shadow-primary-lg transition-all disabled:opacity-60"
            >
              {loading ? '⏳ רושם...' : '🚀 הצטרף חינם'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            בהרשמה אתה מסכים ל<Link href="/terms" className="underline">תנאי השימוש</Link> ול<Link href="/privacy" className="underline">מדיניות הפרטיות</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">טוען...</div>}>
      <RegisterForm />
    </Suspense>
  )
}

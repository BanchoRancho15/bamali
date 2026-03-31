import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'ILS'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, locale = 'he-IL'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateBookingRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'BML-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const VENUE_TYPES: Record<string, string> = {
  gallery: 'גלריה',
  studio: 'סטודיו',
  cafe: 'בית קפה',
  rooftop: 'גג',
  club: 'מועדון',
  hall: 'אולם',
  outdoor: 'חיצוני',
  other: 'אחר',
}

export const AMENITIES: Record<string, { label: string; icon: string }> = {
  sound: { label: 'מערכת סאונד', icon: '🔊' },
  projector: { label: 'מקרן', icon: '📽️' },
  screen: { label: 'מסך', icon: '🖥️' },
  lighting: { label: 'תאורה', icon: '💡' },
  wifi: { label: 'Wi-Fi', icon: '📶' },
  parking: { label: 'חניה', icon: '🅿️' },
  bar: { label: 'בר', icon: '🍷' },
  ac: { label: 'מיזוג אוויר', icon: '❄️' },
  stage: { label: 'במה', icon: '🎭' },
  kitchen: { label: 'מטבחון', icon: '🍽️' },
  disability: { label: 'נגיש לנכים', icon: '♿' },
  outdoor_space: { label: 'חצר/גג', icon: '🌿' },
}

export const EQUIPMENT_CATEGORIES: Record<string, { label: string; icon: string }> = {
  sound: { label: 'הגברה וסאונד', icon: '🔊' },
  lighting: { label: 'תאורה', icon: '💡' },
  video: { label: 'צילום וידאו', icon: '📹' },
  photo: { label: 'צלם', icon: '📸' },
  screen: { label: 'מסך ומקרן', icon: '📽️' },
  streaming: { label: 'שידור חי', icon: '📡' },
  catering: { label: 'קייטרינג', icon: '🍷' },
  design: { label: 'עיצוב גרפי', icon: '🎨' },
  security: { label: 'אבטחה', icon: '🛡️' },
  other: { label: 'אחר', icon: '🔧' },
}

export const CITIES = [
  'תל אביב-יפו', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה', 'ראשון לציון',
  'פתח תקווה', 'אשדוד', 'רחובות', 'הרצליה', 'חולון', 'בני ברק',
  'אשקלון', 'בת ים', 'כפר סבא', 'רמת גן', 'מודיעין', 'נס ציונה',
]

export const PLATFORM_FEE_RATE = 0.12 // 12% total

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * PLATFORM_FEE_RATE)
}

export function calculateTotal(venuePrice: number, equipmentTotal: number): {
  subtotal: number
  platformFee: number
  total: number
} {
  const subtotal = venuePrice + equipmentTotal
  const platformFee = calculatePlatformFee(subtotal)
  return { subtotal, platformFee, total: subtotal + platformFee }
}

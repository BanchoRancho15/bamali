export type UserRole = 'organizer' | 'venue_owner' | 'supplier' | 'admin'

export type VenueType = 'gallery' | 'studio' | 'cafe' | 'rooftop' | 'club' | 'hall' | 'outdoor' | 'other'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partial'

export type EquipmentCategory = 'sound' | 'lighting' | 'video' | 'photo' | 'screen' | 'streaming' | 'catering' | 'design' | 'security' | 'other'

export interface Profile {
  id: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: UserRole
  bio?: string
  website?: string
  rating: number
  total_reviews: number
  is_verified: boolean
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  owner_id: string
  owner?: Profile
  name: string
  slug: string
  description?: string
  venue_type: VenueType
  address: string
  city: string
  neighborhood?: string
  lat?: number
  lng?: number
  capacity_min: number
  capacity_max: number
  price_per_evening: number
  price_per_hour?: number
  currency: string
  amenities: string[]
  images: string[]
  main_image?: string
  is_active: boolean
  is_featured: boolean
  min_booking_hours: number
  cancellation_policy: string
  rating: number
  total_reviews: number
  total_bookings: number
  created_at: string
  updated_at: string
}

export interface VenueAvailability {
  id: string
  venue_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  custom_price?: number
  notes?: string
}

export interface Equipment {
  id: string
  supplier_id: string
  supplier?: Profile
  name: string
  slug: string
  category: EquipmentCategory
  description?: string
  price: number
  pricing_type: 'per_event' | 'per_hour' | 'per_day'
  is_active: boolean
  images: string[]
  tags: string[]
  rating: number
  created_at: string
}

export interface Booking {
  id: string
  booking_ref: string
  organizer_id: string
  organizer?: Profile
  venue_id: string
  venue?: Venue
  event_name: string
  event_description?: string
  event_type?: string
  expected_guests?: number
  event_date: string
  start_time: string
  end_time: string
  venue_price: number
  equipment_total: number
  platform_fee: number
  total_amount: number
  status: BookingStatus
  payment_status: PaymentStatus
  stripe_payment_intent_id?: string
  paid_at?: string
  notes?: string
  is_public: boolean
  equipment_items?: BookingEquipment[]
  created_at: string
  updated_at: string
}

export interface BookingEquipment {
  id: string
  booking_id: string
  equipment_id: string
  equipment?: Equipment
  quantity: number
  unit_price: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewer?: Profile
  venue_id?: string
  equipment_id?: string
  rating: number
  title?: string
  body?: string
  is_public: boolean
  created_at: string
}

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  sender?: Profile
  body: string
  is_read: boolean
  created_at: string
}

// Search / Filter types
export interface VenueSearchParams {
  q?: string
  city?: string
  venue_type?: VenueType
  capacity?: number
  min_price?: number
  max_price?: number
  amenities?: string[]
  date?: string
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest'
}

export interface BookingFormData {
  venue_id: string
  event_name: string
  event_description?: string
  event_type?: string
  expected_guests?: number
  event_date: string
  start_time: string
  end_time: string
  equipment_ids: string[]
  notes?: string
}

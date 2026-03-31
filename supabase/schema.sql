-- =====================================================
-- BamaLi Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search

-- =====================================================
-- PROFILES (extends Supabase Auth users)
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'organizer' CHECK (role IN ('organizer', 'venue_owner', 'supplier', 'admin')),
  bio TEXT,
  website TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_account_id TEXT, -- for venue owners / suppliers to receive payments
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VENUES
-- =====================================================
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  venue_type TEXT NOT NULL CHECK (venue_type IN ('gallery', 'studio', 'cafe', 'rooftop', 'club', 'hall', 'outdoor', 'other')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  capacity_min INT DEFAULT 1,
  capacity_max INT NOT NULL,
  price_per_evening INT NOT NULL, -- in ILS
  price_per_hour INT,
  currency TEXT DEFAULT 'ILS',
  amenities TEXT[] DEFAULT '{}', -- ['sound', 'projector', 'lighting', 'wifi', 'parking', 'bar', 'ac']
  images TEXT[] DEFAULT '{}',
  main_image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  min_booking_hours INT DEFAULT 2,
  cancellation_policy TEXT DEFAULT '48h' CHECK (cancellation_policy IN ('24h', '48h', '72h', '7d', 'no_refund')),
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  total_bookings INT DEFAULT 0,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search
CREATE INDEX venues_city_idx ON venues(city);
CREATE INDEX venues_type_idx ON venues(venue_type);
CREATE INDEX venues_capacity_idx ON venues(capacity_max);
CREATE INDEX venues_price_idx ON venues(price_per_evening);
CREATE INDEX venues_name_search ON venues USING gin(name gin_trgm_ops);
CREATE INDEX venues_active_idx ON venues(is_active) WHERE is_active = TRUE;

-- =====================================================
-- VENUE AVAILABILITY (Calendar)
-- =====================================================
CREATE TABLE venue_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME DEFAULT '18:00',
  end_time TIME DEFAULT '23:00',
  is_available BOOLEAN DEFAULT TRUE,
  custom_price INT, -- override price_per_evening for this date
  notes TEXT,
  UNIQUE(venue_id, date)
);

CREATE INDEX availability_venue_date ON venue_availability(venue_id, date);

-- =====================================================
-- EQUIPMENT & SERVICES
-- =====================================================
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sound', 'lighting', 'video', 'photo', 'screen', 'streaming', 'catering', 'design', 'security', 'other')),
  description TEXT,
  price INT NOT NULL, -- base price per event
  pricing_type TEXT DEFAULT 'per_event' CHECK (pricing_type IN ('per_event', 'per_hour', 'per_day')),
  is_active BOOLEAN DEFAULT TRUE,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX equipment_category_idx ON equipment(category);
CREATE INDEX equipment_active_idx ON equipment(is_active) WHERE is_active = TRUE;

-- =====================================================
-- BOOKINGS
-- =====================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL DEFAULT 'BML-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8)),
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  venue_id UUID NOT NULL REFERENCES venues(id),

  -- Event details
  event_name TEXT NOT NULL,
  event_description TEXT,
  event_type TEXT, -- 'lecture', 'workshop', 'performance', 'networking', etc.
  expected_guests INT,

  -- Timing
  event_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '19:00',
  end_time TIME NOT NULL DEFAULT '22:00',

  -- Pricing breakdown
  venue_price INT NOT NULL,         -- base venue price
  equipment_total INT DEFAULT 0,    -- total equipment cost
  platform_fee INT DEFAULT 0,       -- platform commission
  total_amount INT NOT NULL,        -- grand total in ILS (agorot)

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partial')),

  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  paid_at TIMESTAMPTZ,

  -- Meta
  notes TEXT,
  is_public BOOLEAN DEFAULT FALSE, -- show on public event calendar
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX bookings_organizer_idx ON bookings(organizer_id);
CREATE INDEX bookings_venue_idx ON bookings(venue_id);
CREATE INDEX bookings_date_idx ON bookings(event_date);
CREATE INDEX bookings_status_idx ON bookings(status);

-- =====================================================
-- BOOKING EQUIPMENT (junction table)
-- =====================================================
CREATE TABLE booking_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  quantity INT DEFAULT 1,
  unit_price INT NOT NULL,
  total_price INT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  UNIQUE(booking_id, equipment_id)
);

-- =====================================================
-- REVIEWS
-- =====================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  venue_id UUID REFERENCES venues(id),
  equipment_id UUID REFERENCES equipment(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id, venue_id),
  CHECK (venue_id IS NOT NULL OR equipment_id IS NOT NULL)
);

-- =====================================================
-- MESSAGES (Chat between organizer and venue)
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX messages_booking_idx ON messages(booking_id);

-- =====================================================
-- WISHLISTS / SAVED VENUES
-- =====================================================
CREATE TABLE saved_venues (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, venue_id)
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'organizer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update venue rating when review added
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE venues SET
    rating = (SELECT AVG(rating) FROM reviews WHERE venue_id = NEW.venue_id AND is_public = TRUE),
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE venue_id = NEW.venue_id AND is_public = TRUE)
  WHERE id = NEW.venue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER venue_rating_updated
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW WHEN (NEW.venue_id IS NOT NULL)
  EXECUTE FUNCTION update_venue_rating();

-- Generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9\u0590-\u05FF]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM venues WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_venues ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Venues: public can read active, owners can CRUD own
CREATE POLICY "Active venues are public" ON venues FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Venue owners can manage own" ON venues FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all venues" ON venues FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Availability: public can read, owner can manage
CREATE POLICY "Availability is public" ON venue_availability FOR SELECT USING (TRUE);
CREATE POLICY "Venue owner can manage availability" ON venue_availability FOR ALL USING (
  EXISTS (SELECT 1 FROM venues WHERE id = venue_id AND owner_id = auth.uid())
);

-- Equipment: public read, supplier manages own
CREATE POLICY "Active equipment is public" ON equipment FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Suppliers manage own equipment" ON equipment FOR ALL USING (auth.uid() = supplier_id);

-- Bookings: involved parties only
CREATE POLICY "Organizers see own bookings" ON bookings FOR SELECT USING (auth.uid() = organizer_id);
CREATE POLICY "Venue owners see their bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM venues WHERE id = venue_id AND owner_id = auth.uid())
);
CREATE POLICY "Organizers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = organizer_id);

-- Messages: booking participants only
CREATE POLICY "Booking participants see messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR
  EXISTS (SELECT 1 FROM bookings b WHERE b.id = booking_id AND (b.organizer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM venues WHERE id = b.venue_id AND owner_id = auth.uid())))
);
CREATE POLICY "Booking participants can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Saved venues: own only
CREATE POLICY "Users see own saved" ON saved_venues FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own saved" ON saved_venues FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA (Demo venues for development)
-- =====================================================

-- Note: In production, remove or run separately
-- INSERT INTO venues (...) VALUES (...) -- will be done via admin panel

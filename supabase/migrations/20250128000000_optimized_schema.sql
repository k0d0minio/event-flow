-- Optimized Database Schema Migration
-- This migration replaces the previous schema with a normalized, scalable structure

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Drop old tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS public.artist_media CASCADE;
DROP TABLE IF EXISTS public.artists CASCADE;
DROP TABLE IF EXISTS public.venues CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop old functions and triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_venue() CASCADE;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- 1. Profiles (User Accounts)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('artist', 'venue', 'booker', 'admin')),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- 2. Artists (Artist Business Entities)
CREATE TYPE formation_type AS ENUM ('solo', 'duo', 'group', 'orchestra', 'hybrid');
CREATE TYPE professional_level AS ENUM ('amateur', 'semi-pro', 'professional');

CREATE TABLE public.artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stage_name TEXT,
  formation_type formation_type,
  bio_short TEXT CHECK (char_length(bio_short) <= 500),
  bio_long TEXT,
  years_active INTEGER CHECK (years_active >= 0 AND years_active <= 100),
  professional_level professional_level,
  primary_genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(profile_id)
);

CREATE INDEX idx_artists_profile_id ON public.artists(profile_id);
CREATE INDEX idx_artists_stage_name ON public.artists USING gin(to_tsvector('english', stage_name));
CREATE INDEX idx_artists_primary_genre ON public.artists(primary_genre);
CREATE INDEX idx_artists_is_active ON public.artists(is_active);
CREATE INDEX idx_artists_is_verified ON public.artists(is_verified);
CREATE INDEX idx_artists_active_verified ON public.artists(is_active, is_verified);

-- 3. Artist Genres (Many-to-Many)
CREATE TABLE public.artist_genres (
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  genre TEXT NOT NULL,
  PRIMARY KEY (artist_id, genre)
);

CREATE INDEX idx_artist_genres_artist_id ON public.artist_genres(artist_id);
CREATE INDEX idx_artist_genres_genre ON public.artist_genres(genre);

-- 4. Artist Influences (Many-to-Many)
CREATE TABLE public.artist_influences (
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  influence TEXT NOT NULL,
  PRIMARY KEY (artist_id, influence)
);

CREATE INDEX idx_artist_influences_artist_id ON public.artist_influences(artist_id);
CREATE INDEX idx_artist_influences_influence ON public.artist_influences(influence);

-- 5. Venues (Venue Business Entities)
CREATE TYPE venue_type AS ENUM ('club', 'theater', 'bar', 'festival', 'outdoor', 'concert_hall', 'other');

CREATE TABLE public.venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  venue_name TEXT,
  commercial_name TEXT,
  venue_type venue_type,
  capacity_min INTEGER CHECK (capacity_min > 0),
  capacity_max INTEGER CHECK (capacity_max >= capacity_min),
  history TEXT,
  ambiance TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(profile_id)
);

CREATE INDEX idx_venues_profile_id ON public.venues(profile_id);
CREATE INDEX idx_venues_venue_name ON public.venues USING gin(to_tsvector('english', venue_name));
CREATE INDEX idx_venues_venue_type ON public.venues(venue_type);
CREATE INDEX idx_venues_capacity_min ON public.venues(capacity_min);
CREATE INDEX idx_venues_capacity_max ON public.venues(capacity_max);
CREATE INDEX idx_venues_is_active ON public.venues(is_active);
CREATE INDEX idx_venues_is_verified ON public.venues(is_verified);
CREATE INDEX idx_venues_active_verified ON public.venues(is_active, is_verified);

-- 6. Venue Locations (Geographic Data)
CREATE TABLE public.venue_locations (
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE PRIMARY KEY,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  coordinates POINT,
  public_transport TEXT[],
  parking TEXT,
  pmr_access BOOLEAN DEFAULT false
);

CREATE INDEX idx_venue_locations_city ON public.venue_locations(city);
CREATE INDEX idx_venue_locations_postal_code ON public.venue_locations(postal_code);
CREATE INDEX idx_venue_locations_country ON public.venue_locations(country);
CREATE INDEX idx_venue_locations_latitude ON public.venue_locations(latitude);
CREATE INDEX idx_venue_locations_longitude ON public.venue_locations(longitude);
CREATE INDEX idx_venue_locations_coordinates ON public.venue_locations USING GIST(coordinates);

-- Function to update coordinates from lat/lng
CREATE OR REPLACE FUNCTION update_venue_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.coordinates = ST_MakePoint(NEW.longitude, NEW.latitude);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venue_coordinates_trigger
  BEFORE INSERT OR UPDATE ON public.venue_locations
  FOR EACH ROW EXECUTE FUNCTION update_venue_coordinates();

-- 7. Venue Genres (Many-to-Many)
CREATE TABLE public.venue_genres (
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  genre TEXT NOT NULL,
  is_preferred BOOLEAN DEFAULT true NOT NULL,
  PRIMARY KEY (venue_id, genre)
);

CREATE INDEX idx_venue_genres_venue_id ON public.venue_genres(venue_id);
CREATE INDEX idx_venue_genres_genre ON public.venue_genres(genre);
CREATE INDEX idx_venue_genres_preferred ON public.venue_genres(venue_id, is_preferred);

-- 8. Venue Technical Equipment
CREATE TABLE public.venue_technical_equipment (
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE PRIMARY KEY,
  sound_system TEXT,
  lighting TEXT,
  stage_dimensions TEXT,
  control_room TEXT,
  artist_spaces TEXT
);

-- 9. Venue Programming Preferences
CREATE TABLE public.venue_programming (
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE PRIMARY KEY,
  event_frequency TEXT,
  preferred_schedule TEXT,
  budget_range_min INTEGER CHECK (budget_range_min >= 0),
  budget_range_max INTEGER CHECK (budget_range_max >= budget_range_min)
);

CREATE INDEX idx_venue_programming_budget_min ON public.venue_programming(budget_range_min);
CREATE INDEX idx_venue_programming_budget_max ON public.venue_programming(budget_range_max);

-- 10. Venue Services
CREATE TABLE public.venue_services (
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE PRIMARY KEY,
  accommodation_available BOOLEAN DEFAULT false NOT NULL,
  accommodation_capacity INTEGER CHECK (accommodation_capacity > 0),
  catering_available BOOLEAN DEFAULT false NOT NULL,
  catering_type TEXT,
  ticketing TEXT
);

-- 11. Bookers (Booker Accounts)
CREATE TABLE public.bookers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(profile_id)
);

CREATE INDEX idx_bookers_profile_id ON public.bookers(profile_id);

-- 12. Booker-Venue Relationships (Many-to-Many)
CREATE TYPE booker_role AS ENUM ('primary', 'secondary');

CREATE TABLE public.booker_venue_relationships (
  booker_id UUID REFERENCES public.bookers(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  role booker_role DEFAULT 'secondary' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (booker_id, venue_id)
);

CREATE INDEX idx_booker_venue_booker_id ON public.booker_venue_relationships(booker_id);
CREATE INDEX idx_booker_venue_venue_id ON public.booker_venue_relationships(venue_id);

-- 13. Media (Unified Media Storage)
CREATE TYPE entity_type AS ENUM ('artist', 'venue');
CREATE TYPE media_type AS ENUM ('audio', 'photo', 'video', 'document');

CREATE TABLE public.media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  media_type media_type NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_media_entity ON public.media(entity_type, entity_id);
CREATE INDEX idx_media_entity_type ON public.media(entity_type, entity_id, media_type);
CREATE INDEX idx_media_storage_path ON public.media(storage_path);
CREATE INDEX idx_media_display_order ON public.media(entity_type, entity_id, display_order);

-- 14. Events (Events/Bookings)
CREATE TYPE event_status AS ENUM ('draft', 'pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE NOT NULL,
  booker_id UUID REFERENCES public.bookers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  start_time TIME,
  end_time TIME,
  status event_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_events_booker_id ON public.events(booker_id);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_venue_date ON public.events(venue_id, event_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_status_date ON public.events(status, event_date);

-- 15. Event Artists (Many-to-Many)
CREATE TABLE public.event_artists (
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  is_headliner BOOLEAN DEFAULT false NOT NULL,
  performance_order INTEGER DEFAULT 0,
  PRIMARY KEY (event_id, artist_id)
);

CREATE INDEX idx_event_artists_event_id ON public.event_artists(event_id);
CREATE INDEX idx_event_artists_artist_id ON public.event_artists(artist_id);
CREATE INDEX idx_event_artists_order ON public.event_artists(event_id, performance_order);

-- 16. Event Offers (Booking Offers/Proposals)
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE offered_by AS ENUM ('venue', 'artist');

CREATE TABLE public.event_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  offered_by offered_by NOT NULL,
  offer_amount DECIMAL(10, 2) CHECK (offer_amount >= 0),
  status offer_status DEFAULT 'pending' NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_event_offers_event_id ON public.event_offers(event_id);
CREATE INDEX idx_event_offers_artist_id ON public.event_offers(artist_id);
CREATE INDEX idx_event_offers_status ON public.event_offers(artist_id, status);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is venue
CREATE OR REPLACE FUNCTION public.is_venue()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'venue'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is booker
CREATE OR REPLACE FUNCTION public.is_booker()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'booker'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if booker is associated with venue
CREATE OR REPLACE FUNCTION public.booker_has_venue_access(venue_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.booker_venue_relationships bvr
    JOIN public.bookers b ON b.id = bvr.booker_id
    WHERE b.profile_id = auth.uid() AND bvr.venue_id = venue_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email)
  VALUES (NEW.id, 'artist', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bookers_updated_at
  BEFORE UPDATE ON public.bookers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_event_offers_updated_at
  BEFORE UPDATE ON public.event_offers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_influences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_technical_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_programming ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booker_venue_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_offers ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Artists RLS Policies
CREATE POLICY "Artists can view their own artist record"
  ON public.artists FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Artists can update their own artist record"
  ON public.artists FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Artists can insert their own artist record"
  ON public.artists FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Public can view active artists"
  ON public.artists FOR SELECT
  USING (is_active = true);

CREATE POLICY "Venues can view active artists"
  ON public.artists FOR SELECT
  USING (is_active = true OR public.is_venue());

CREATE POLICY "Bookers can view active artists"
  ON public.artists FOR SELECT
  USING (is_active = true OR public.is_booker());

CREATE POLICY "Admins can view all artists"
  ON public.artists FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all artists"
  ON public.artists FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can insert artists"
  ON public.artists FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete artists"
  ON public.artists FOR DELETE
  USING (public.is_admin());

-- Artist Genres RLS Policies
CREATE POLICY "Artists can manage their own genres"
  ON public.artist_genres FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE id = artist_genres.artist_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view artist genres"
  ON public.artist_genres FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE id = artist_genres.artist_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage all artist genres"
  ON public.artist_genres FOR ALL
  USING (public.is_admin());

-- Artist Influences RLS Policies
CREATE POLICY "Artists can manage their own influences"
  ON public.artist_influences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE id = artist_influences.artist_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view artist influences"
  ON public.artist_influences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.artists
      WHERE id = artist_influences.artist_id AND is_active = true
    )
  );

CREATE POLICY "Admins can manage all artist influences"
  ON public.artist_influences FOR ALL
  USING (public.is_admin());

-- Venues RLS Policies
CREATE POLICY "Venues can view their own venue record"
  ON public.venues FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Venues can update their own venue record"
  ON public.venues FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Venues can insert their own venue record"
  ON public.venues FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Public can view active venues"
  ON public.venues FOR SELECT
  USING (is_active = true);

CREATE POLICY "Bookers can view venues they're associated with"
  ON public.venues FOR SELECT
  USING (
    is_active = true OR
    public.booker_has_venue_access(id)
  );

CREATE POLICY "Bookers can update venues they're associated with"
  ON public.venues FOR UPDATE
  USING (public.booker_has_venue_access(id));

CREATE POLICY "Admins can view all venues"
  ON public.venues FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all venues"
  ON public.venues FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can insert venues"
  ON public.venues FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete venues"
  ON public.venues FOR DELETE
  USING (public.is_admin());

-- Venue Locations RLS Policies
CREATE POLICY "Venues can manage their own location"
  ON public.venue_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_locations.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view venue locations"
  ON public.venue_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_locations.venue_id AND is_active = true
    )
  );

CREATE POLICY "Bookers can view venue locations they're associated with"
  ON public.venue_locations FOR SELECT
  USING (public.booker_has_venue_access(venue_id));

CREATE POLICY "Admins can manage all venue locations"
  ON public.venue_locations FOR ALL
  USING (public.is_admin());

-- Venue Genres RLS Policies
CREATE POLICY "Venues can manage their own genres"
  ON public.venue_genres FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_genres.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view venue genres"
  ON public.venue_genres FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_genres.venue_id AND is_active = true
    )
  );

CREATE POLICY "Bookers can manage genres for associated venues"
  ON public.venue_genres FOR ALL
  USING (public.booker_has_venue_access(venue_id));

CREATE POLICY "Admins can manage all venue genres"
  ON public.venue_genres FOR ALL
  USING (public.is_admin());

-- Venue Technical Equipment RLS Policies
CREATE POLICY "Venues can manage their own technical equipment"
  ON public.venue_technical_equipment FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_technical_equipment.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view venue technical equipment"
  ON public.venue_technical_equipment FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_technical_equipment.venue_id AND is_active = true
    )
  );

CREATE POLICY "Bookers can manage technical equipment for associated venues"
  ON public.venue_technical_equipment FOR ALL
  USING (public.booker_has_venue_access(venue_id));

CREATE POLICY "Admins can manage all venue technical equipment"
  ON public.venue_technical_equipment FOR ALL
  USING (public.is_admin());

-- Venue Programming RLS Policies
CREATE POLICY "Venues can manage their own programming"
  ON public.venue_programming FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_programming.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view venue programming"
  ON public.venue_programming FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_programming.venue_id AND is_active = true
    )
  );

CREATE POLICY "Bookers can manage programming for associated venues"
  ON public.venue_programming FOR ALL
  USING (public.booker_has_venue_access(venue_id));

CREATE POLICY "Admins can manage all venue programming"
  ON public.venue_programming FOR ALL
  USING (public.is_admin());

-- Venue Services RLS Policies
CREATE POLICY "Venues can manage their own services"
  ON public.venue_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_services.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view venue services"
  ON public.venue_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = venue_services.venue_id AND is_active = true
    )
  );

CREATE POLICY "Bookers can manage services for associated venues"
  ON public.venue_services FOR ALL
  USING (public.booker_has_venue_access(venue_id));

CREATE POLICY "Admins can manage all venue services"
  ON public.venue_services FOR ALL
  USING (public.is_admin());

-- Bookers RLS Policies
CREATE POLICY "Bookers can view their own record"
  ON public.bookers FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Bookers can update their own record"
  ON public.bookers FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Bookers can insert their own record"
  ON public.bookers FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can view all bookers"
  ON public.bookers FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage all bookers"
  ON public.bookers FOR ALL
  USING (public.is_admin());

-- Booker-Venue Relationships RLS Policies
CREATE POLICY "Bookers can view their own relationships"
  ON public.booker_venue_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookers
      WHERE id = booker_venue_relationships.booker_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Bookers can manage their own relationships"
  ON public.booker_venue_relationships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.bookers
      WHERE id = booker_venue_relationships.booker_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Venues can view relationships for their venues"
  ON public.booker_venue_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = booker_venue_relationships.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all relationships"
  ON public.booker_venue_relationships FOR ALL
  USING (public.is_admin());

-- Media RLS Policies
CREATE POLICY "Artists can manage their own media"
  ON public.media FOR ALL
  USING (
    (entity_type = 'artist' AND entity_id IN (
      SELECT id FROM public.artists WHERE profile_id = auth.uid()
    ))
  );

CREATE POLICY "Venues can manage their own media"
  ON public.media FOR ALL
  USING (
    (entity_type = 'venue' AND entity_id IN (
      SELECT id FROM public.venues WHERE profile_id = auth.uid()
    ))
  );

CREATE POLICY "Bookers can manage media for associated venues"
  ON public.media FOR ALL
  USING (
    (entity_type = 'venue' AND public.booker_has_venue_access(entity_id))
  );

CREATE POLICY "Public can view media for active entities"
  ON public.media FOR SELECT
  USING (
    (entity_type = 'artist' AND entity_id IN (
      SELECT id FROM public.artists WHERE is_active = true
    )) OR
    (entity_type = 'venue' AND entity_id IN (
      SELECT id FROM public.venues WHERE is_active = true
    ))
  );

CREATE POLICY "Admins can manage all media"
  ON public.media FOR ALL
  USING (public.is_admin());

-- Events RLS Policies
CREATE POLICY "Venues can manage events for their venues"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE id = events.venue_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Bookers can manage events for associated venues"
  ON public.events FOR ALL
  USING (public.booker_has_venue_access(venue_id));

CREATE POLICY "Artists can view events they're part of"
  ON public.events FOR SELECT
  USING (
    id IN (
      SELECT event_id FROM public.event_artists
      WHERE artist_id IN (
        SELECT id FROM public.artists WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Public can view confirmed events"
  ON public.events FOR SELECT
  USING (status = 'confirmed' OR status = 'completed');

CREATE POLICY "Admins can manage all events"
  ON public.events FOR ALL
  USING (public.is_admin());

-- Event Artists RLS Policies
CREATE POLICY "Venues can manage artists for their events"
  ON public.event_artists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.venues v ON v.id = e.venue_id
      WHERE e.id = event_artists.event_id AND v.profile_id = auth.uid()
    )
  );

CREATE POLICY "Bookers can manage artists for associated venue events"
  ON public.event_artists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_artists.event_id AND public.booker_has_venue_access(e.venue_id)
    )
  );

CREATE POLICY "Artists can view events they're part of"
  ON public.event_artists FOR SELECT
  USING (
    artist_id IN (
      SELECT id FROM public.artists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Public can view confirmed event artists"
  ON public.event_artists FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE status = 'confirmed' OR status = 'completed'
    )
  );

CREATE POLICY "Admins can manage all event artists"
  ON public.event_artists FOR ALL
  USING (public.is_admin());

-- Event Offers RLS Policies
CREATE POLICY "Venues can manage offers for their events"
  ON public.event_offers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      JOIN public.venues v ON v.id = e.venue_id
      WHERE e.id = event_offers.event_id AND v.profile_id = auth.uid()
    )
  );

CREATE POLICY "Bookers can manage offers for associated venue events"
  ON public.event_offers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_offers.event_id AND public.booker_has_venue_access(e.venue_id)
    )
  );

CREATE POLICY "Artists can manage offers for their events"
  ON public.event_offers FOR ALL
  USING (
    artist_id IN (
      SELECT id FROM public.artists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all event offers"
  ON public.event_offers FOR ALL
  USING (public.is_admin());


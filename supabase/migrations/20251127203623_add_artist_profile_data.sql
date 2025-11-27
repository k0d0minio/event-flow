-- Add artist_data JSONB column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS artist_data JSONB DEFAULT '{}';

-- Create enum for media type
CREATE TYPE public.media_type AS ENUM ('audio', 'photo', 'video', 'document');

-- Create artist_media table
CREATE TABLE IF NOT EXISTS public.artist_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type public.media_type NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security on artist_media
ALTER TABLE public.artist_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artist_media
CREATE POLICY "Artists can view their own media"
  ON public.artist_media FOR SELECT
  USING (auth.uid() = artist_id);

CREATE POLICY "Artists can insert their own media"
  ON public.artist_media FOR INSERT
  WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists can update their own media"
  ON public.artist_media FOR UPDATE
  USING (auth.uid() = artist_id);

CREATE POLICY "Artists can delete their own media"
  ON public.artist_media FOR DELETE
  USING (auth.uid() = artist_id);

-- Admins can view all media
CREATE POLICY "Admins can view all media"
  ON public.artist_media FOR SELECT
  USING (public.is_admin());

-- Add trigger for updated_at on artist_media
CREATE TRIGGER update_artist_media_updated_at
  BEFORE UPDATE ON public.artist_media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_artist_data_gin ON public.profiles USING GIN (artist_data);
CREATE INDEX IF NOT EXISTS idx_artist_media_artist_id ON public.artist_media(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_media_type ON public.artist_media(type);
CREATE INDEX IF NOT EXISTS idx_artist_media_artist_type ON public.artist_media(artist_id, type);

-- Create index for JSONB queries on artist_data
CREATE INDEX IF NOT EXISTS idx_profiles_artist_data_genre ON public.profiles USING GIN ((artist_data->'primary_genre'));
CREATE INDEX IF NOT EXISTS idx_profiles_artist_data_formation ON public.profiles USING GIN ((artist_data->'formation_type'));


-- Add venue_data JSONB column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS venue_data JSONB DEFAULT '{}';

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_venue_data_gin ON public.profiles USING GIN (venue_data);

-- Create index for JSONB queries on venue_data
CREATE INDEX IF NOT EXISTS idx_profiles_venue_data_type ON public.profiles USING GIN ((venue_data->'venue_type'));
CREATE INDEX IF NOT EXISTS idx_profiles_venue_data_name ON public.profiles USING GIN ((venue_data->'venue_name'));


-- Helper function to check if current user is a venue
CREATE OR REPLACE FUNCTION public.is_venue()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'venue'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for venues to view artist profiles
CREATE POLICY "Venues can view artist profiles"
  ON public.profiles FOR SELECT
  USING (
    public.is_venue() AND role = 'artist'
  );

-- RLS Policies for venues to view artist data
CREATE POLICY "Venues can view artist data"
  ON public.artists FOR SELECT
  USING (public.is_venue());

-- RLS Policies for venues to view artist media
CREATE POLICY "Venues can view artist media"
  ON public.artist_media FOR SELECT
  USING (public.is_venue());


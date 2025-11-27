-- Add admin role support to profiles table

-- First, drop the existing CHECK constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new CHECK constraint that includes 'admin' role
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('artist', 'venue', 'admin'));

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for admins on profiles table
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- RLS Policies for admins on artists table
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

-- RLS Policies for admins on venues table
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


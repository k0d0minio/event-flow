-- Storage buckets need to be created via Supabase Dashboard or Management API
-- This migration documents the required setup:
-- 
-- Buckets to create:
-- 1. artist-audio (public: false, file_size_limit: 50MB, allowed_mime_types: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'])
-- 2. artist-photos (public: false, file_size_limit: 10MB, allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'])
-- 3. artist-documents (public: false, file_size_limit: 20MB, allowed_mime_types: ['application/pdf'])
--
-- Storage policies are managed via the storage schema and should be set up via Supabase Dashboard
-- or using the Supabase Management API. The policies should allow:
-- - Artists to upload/read/delete their own files (path matches their user ID)
-- - Admins to read all files

-- Note: Storage policies cannot be created via SQL migrations in the public schema
-- They must be created via the Supabase Dashboard under Storage > Policies
-- or via the Supabase Management API


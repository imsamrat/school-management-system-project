-- ==============================================================================
-- 🚀 ALL-IN-ONE FIX SCRIPT
-- Run this entire script in your Supabase SQL Editor to fix the 500 errors and the Bucket error!
-- ==============================================================================

-- 1. Create the 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up Storage Policies so the frontend can upload images
DO $$
BEGIN
    -- Select policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to Avatars'
    ) THEN
        CREATE POLICY "Public Access to Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
    END IF;

    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Avatar Uploads'
    ) THEN
        CREATE POLICY "Allow Avatar Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Avatar Updates'
    ) THEN
        CREATE POLICY "Allow Avatar Updates" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'avatars');
    END IF;

    -- Delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Avatar Deletes'
    ) THEN
        CREATE POLICY "Allow Avatar Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');
    END IF;
END $$;


-- 3. Ensure the Staff Unification columns exist (just in case they were missed earlier)
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS is_teacher BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS teacher_id_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS qualification VARCHAR(255),
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);

-- 4. CRITICAL: Reload the PostgREST schema cache so the backend API recognizes the new columns
NOTIFY pgrst, 'reload schema';

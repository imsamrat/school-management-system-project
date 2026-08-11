-- ==============================================================================
-- 🚀 NEW FEATURE: ADMISSION APPLICATIONS
-- Run this script in your Supabase SQL Editor to create the Admissions table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(150),
    previous_school VARCHAR(255),
    applied_class VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_admission_applications_status ON admission_applications(status);

-- CRITICAL: Reload the PostgREST schema cache so the backend API recognizes the new table
NOTIFY pgrst, 'reload schema';

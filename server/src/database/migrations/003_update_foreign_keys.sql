-- ==============================================================================
-- 🚀 STAFF UNIFICATION - PART 2: UPDATE FOREIGN KEYS
-- Run this script in your Supabase SQL Editor to fix Course Assignments and Class Routines
-- ==============================================================================

-- 1. Update Course Assignments table
ALTER TABLE course_assignments
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

UPDATE course_assignments
SET employee_id = teacher_id;

ALTER TABLE course_assignments
  DROP COLUMN IF EXISTS teacher_id;

-- 2. Update Class Routines table
ALTER TABLE class_routines
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

UPDATE class_routines
SET employee_id = teacher_id;

ALTER TABLE class_routines
  DROP COLUMN IF EXISTS teacher_id;

-- 3. Update Teacher Attendance table
ALTER TABLE teacher_attendance
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

UPDATE teacher_attendance
SET employee_id = teacher_id;

ALTER TABLE teacher_attendance
  DROP COLUMN IF EXISTS teacher_id;

-- 4. CRITICAL: Reload the PostgREST schema cache so the backend API recognizes the new columns
NOTIFY pgrst, 'reload schema';

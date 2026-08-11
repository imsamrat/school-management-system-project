-- =============================================
-- STAFF UNIFICATION MIGRATION
-- Run this in your Supabase SQL Editor
-- =============================================

-- Step 1: Add teacher columns to employees table
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS is_teacher BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS teacher_id_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS qualification VARCHAR(255),
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
  ADD COLUMN IF NOT EXISTS teacher_joining_date DATE;

-- Step 2: Migrate all rows from teachers into employees
INSERT INTO employees (
  id, school_id, user_id, employee_id_code, teacher_id_code,
  first_name, last_name, photo_url, gender, date_of_birth,
  department, designation, joining_date, employment_type,
  phone, email, address, salary, bank_name, bank_account,
  emergency_contact, status, qualification, specialization,
  is_teacher, created_at, updated_at, deleted_at
)
SELECT
  id, school_id, user_id, employee_id_code, teacher_id_code,
  first_name, last_name, photo_url, gender, date_of_birth,
  department, designation, joining_date, employment_type,
  phone, email, address, salary, bank_name, bank_account,
  emergency_contact, status, qualification, specialization,
  true AS is_teacher, created_at, updated_at, deleted_at
FROM teachers
ON CONFLICT (id) DO NOTHING;

-- Step 3: Update course_assignments to reference employees instead of teachers
-- First add the new column
ALTER TABLE course_assignments
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

-- Copy teacher_id values into employee_id
UPDATE course_assignments
SET employee_id = teacher_id;

-- Step 4: Update class_routines similarly
ALTER TABLE class_routines
  ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

UPDATE class_routines
SET employee_id = teacher_id;

-- Step 5: Add indexes
CREATE INDEX IF NOT EXISTS idx_employees_is_teacher ON employees(is_teacher);
CREATE INDEX IF NOT EXISTS idx_employees_teacher_id_code ON employees(teacher_id_code);

-- =============================================
-- School Management System — Seed Data
-- =============================================
-- Realistic demo data for development
-- =============================================

-- 1. School
INSERT INTO schools (id, name, logo_url, address, city, country, phone, email, website, principal_name, established_year)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Green Valley International School',
    NULL,
    '123 Education Road, Dhanmondi',
    'Dhaka',
    'Bangladesh',
    '+880-2-12345678',
    'info@greenvalleyschool.edu',
    'www.greenvalleyschool.edu',
    'Dr. Mohammad Rahman',
    2010
);

-- 2. Permissions
INSERT INTO permissions (id, module, action, description) VALUES
    (uuid_generate_v4(), 'dashboard', 'view', 'View dashboard'),
    (uuid_generate_v4(), 'students', 'view', 'View students'),
    (uuid_generate_v4(), 'students', 'create', 'Create students'),
    (uuid_generate_v4(), 'students', 'edit', 'Edit students'),
    (uuid_generate_v4(), 'students', 'delete', 'Delete students'),
    (uuid_generate_v4(), 'teachers', 'view', 'View teachers'),
    (uuid_generate_v4(), 'teachers', 'create', 'Create teachers'),
    (uuid_generate_v4(), 'teachers', 'edit', 'Edit teachers'),
    (uuid_generate_v4(), 'employees', 'view', 'View employees'),
    (uuid_generate_v4(), 'employees', 'create', 'Create employees'),
    (uuid_generate_v4(), 'employees', 'edit', 'Edit employees'),
    (uuid_generate_v4(), 'attendance', 'view', 'View attendance'),
    (uuid_generate_v4(), 'attendance', 'mark', 'Mark attendance'),
    (uuid_generate_v4(), 'attendance', 'edit', 'Edit attendance'),
    (uuid_generate_v4(), 'exams', 'view', 'View exams'),
    (uuid_generate_v4(), 'exams', 'create', 'Create exams'),
    (uuid_generate_v4(), 'exams', 'manage', 'Manage exams'),
    (uuid_generate_v4(), 'marks', 'view', 'View marks'),
    (uuid_generate_v4(), 'marks', 'enter', 'Enter marks'),
    (uuid_generate_v4(), 'marks', 'edit', 'Edit marks'),
    (uuid_generate_v4(), 'marks', 'publish', 'Publish marks'),
    (uuid_generate_v4(), 'fees', 'view', 'View fees'),
    (uuid_generate_v4(), 'fees', 'collect', 'Collect fees'),
    (uuid_generate_v4(), 'fees', 'refund', 'Refund fees'),
    (uuid_generate_v4(), 'fees', 'report', 'Fee reports'),
    (uuid_generate_v4(), 'payroll', 'view', 'View payroll'),
    (uuid_generate_v4(), 'payroll', 'process', 'Process payroll'),
    (uuid_generate_v4(), 'payroll', 'approve', 'Approve payroll'),
    (uuid_generate_v4(), 'reports', 'view', 'View reports'),
    (uuid_generate_v4(), 'reports', 'export', 'Export reports'),
    (uuid_generate_v4(), 'documents', 'manage', 'Manage documents'),
    (uuid_generate_v4(), 'settings', 'manage', 'Manage settings'),
    (uuid_generate_v4(), 'users', 'manage', 'Manage users'),
    (uuid_generate_v4(), 'audit', 'view', 'View audit logs'),
    (uuid_generate_v4(), 'admissions', 'view', 'View admissions'),
    (uuid_generate_v4(), 'admissions', 'manage', 'Manage admissions'),
    (uuid_generate_v4(), 'notifications', 'view', 'View notifications');

-- 3. Roles
INSERT INTO roles (id, school_id, name, description, is_system_role) VALUES
    ('a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'Super Admin', 'Full system access', true),
    ('a0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'School Admin', 'School-level administration', true),
    ('a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'Principal', 'Head teacher access', true),
    ('a0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'Teacher', 'Teaching staff access', true),
    ('a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'Accountant', 'Finance access', true),
    ('a0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'HR Manager', 'HR access', true),
    ('a0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'Receptionist', 'Front desk access', true),
    ('a0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'Student', 'Student access', true),
    ('a0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'Parent', 'Parent/guardian access', true);

-- 4. Super Admin gets ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id FROM permissions;

-- School Admin gets ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000002', id FROM permissions;

-- Principal gets most permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000003', id FROM permissions
WHERE module || '.' || action NOT IN ('students.delete', 'settings.manage', 'users.manage', 'audit.view');

-- Teacher permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000004', id FROM permissions
WHERE module || '.' || action IN (
    'dashboard.view', 'students.view', 'teachers.view',
    'attendance.view', 'attendance.mark',
    'exams.view', 'marks.view', 'marks.enter',
    'notifications.view'
);

-- Accountant permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000005', id FROM permissions
WHERE module || '.' || action IN (
    'dashboard.view', 'students.view',
    'fees.view', 'fees.collect', 'fees.refund', 'fees.report',
    'payroll.view', 'payroll.process',
    'reports.view', 'reports.export',
    'notifications.view'
);

-- HR Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000006', id FROM permissions
WHERE module || '.' || action IN (
    'dashboard.view', 'teachers.view', 'teachers.create', 'teachers.edit',
    'employees.view', 'employees.create', 'employees.edit',
    'payroll.view', 'payroll.process',
    'reports.view', 'reports.export',
    'notifications.view'
);

-- Receptionist permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000007', id FROM permissions
WHERE module || '.' || action IN (
    'dashboard.view', 'students.view', 'students.create',
    'fees.view', 'fees.collect',
    'admissions.view', 'admissions.manage',
    'notifications.view'
);

-- 5. Users
INSERT INTO users (id, school_id, email, password_hash, full_name, phone, is_active) VALUES
    ('u0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'admin@greenvalley.edu', '$2b$10$placeholder_hash_admin', 'System Administrator', '+880-1711111111', true),
    ('u0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'principal@greenvalley.edu', '$2b$10$placeholder_hash_principal', 'Dr. Mohammad Rahman', '+880-1722222222', true),
    ('u0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'teacher1@greenvalley.edu', '$2b$10$placeholder_hash_teacher1', 'Fatima Akter', '+880-1733333333', true),
    ('u0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'teacher2@greenvalley.edu', '$2b$10$placeholder_hash_teacher2', 'Kamal Hossain', '+880-1744444444', true),
    ('u0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'accountant@greenvalley.edu', '$2b$10$placeholder_hash_acc', 'Rahim Uddin', '+880-1755555555', true);

-- User role assignments
INSERT INTO user_roles (user_id, role_id) VALUES
    ('u0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
    ('u0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003'),
    ('u0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004'),
    ('u0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004'),
    ('u0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005');

-- 6. Academic Year
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current) VALUES
    ('ay000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', '2025-2026', '2025-01-01', '2025-12-31', false),
    ('ay000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', '2026-2027', '2026-01-01', '2026-12-31', true);

-- 7. Classes
INSERT INTO classes (id, school_id, name, numeric_order) VALUES
    ('c0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'Play Group', 1),
    ('c0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'Nursery', 2),
    ('c0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'KG', 3),
    ('c0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'Class 1', 4),
    ('c0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'Class 2', 5),
    ('c0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'Class 3', 6),
    ('c0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'Class 4', 7),
    ('c0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'Class 5', 8);

-- 8. Sections
INSERT INTO sections (id, class_id, name, capacity) VALUES
    ('s0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'A', 25),
    ('s0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'A', 30),
    ('s0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'B', 30),
    ('s0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'A', 35),
    ('s0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 'A', 40),
    ('s0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000004', 'B', 40),
    ('s0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', 'A', 40),
    ('s0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000006', 'A', 40);

-- 9. Subjects
INSERT INTO subjects (id, school_id, name, code, subject_type) VALUES
    ('sb000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'English', 'ENG', 'theory'),
    ('sb000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'Bangla', 'BNG', 'theory'),
    ('sb000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'MATH', 'theory'),
    ('sb000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'Science', 'SCI', 'both'),
    ('sb000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'Drawing', 'DRW', 'practical'),
    ('sb000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'Computer', 'COMP', 'both'),
    ('sb000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'Religion', 'REL', 'theory'),
    ('sb000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'Physical Education', 'PE', 'practical');

-- 10. Teachers
INSERT INTO teachers (id, school_id, user_id, employee_id_code, teacher_id_code, first_name, last_name, gender, phone, email, qualification, specialization, joining_date, department, designation, salary) VALUES
    ('t0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'u0000000-0000-0000-0000-000000000003', 'EMP-001', 'TCH-001', 'Fatima', 'Akter', 'female', '+880-1733333333', 'fatima@greenvalley.edu', 'M.Ed, B.Ed', 'English Literature', '2020-01-15', 'Languages', 'Senior Teacher', 45000),
    ('t0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'u0000000-0000-0000-0000-000000000004', 'EMP-002', 'TCH-002', 'Kamal', 'Hossain', 'male', '+880-1744444444', 'kamal@greenvalley.edu', 'M.Sc Mathematics', 'Applied Mathematics', '2019-06-01', 'Science', 'Head of Department', 50000),
    ('t0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', NULL, 'EMP-003', 'TCH-003', 'Nasrin', 'Begum', 'female', '+880-1766666666', 'nasrin@greenvalley.edu', 'B.Sc, B.Ed', 'General Science', '2021-03-10', 'Science', 'Assistant Teacher', 35000),
    ('t0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', NULL, 'EMP-004', 'TCH-004', 'Abdul', 'Karim', 'male', '+880-1777777777', 'abdul@greenvalley.edu', 'M.A Bangla', 'Bangla Literature', '2018-01-01', 'Languages', 'Senior Teacher', 48000),
    ('t0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', NULL, 'EMP-005', 'TCH-005', 'Sumaiya', 'Islam', 'female', '+880-1788888888', 'sumaiya@greenvalley.edu', 'BFA', 'Fine Arts', '2022-07-01', 'Arts', 'Teacher', 30000);

-- 11. Employees (non-teaching)
INSERT INTO employees (id, school_id, employee_id_code, first_name, last_name, gender, department, designation, joining_date, phone, email, salary) VALUES
    ('e0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'EMP-006', 'Rahim', 'Uddin', 'male', 'Finance', 'Accountant', '2019-04-01', '+880-1755555555', 'rahim@greenvalley.edu', 40000),
    ('e0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'EMP-007', 'Salma', 'Khatun', 'female', 'Administration', 'Receptionist', '2020-08-15', '+880-1799999999', 'salma@greenvalley.edu', 25000),
    ('e0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'EMP-008', 'Jamal', 'Mia', 'male', 'Administration', 'Office Assistant', '2017-02-01', '+880-1700000001', NULL, 18000),
    ('e0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'EMP-009', 'Rafiq', 'Ahmed', 'male', 'Security', 'Security Guard', '2018-11-01', '+880-1700000002', NULL, 15000),
    ('e0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'EMP-010', 'Amina', 'Begum', 'female', 'Maintenance', 'Cleaner', '2019-05-01', '+880-1700000003', NULL, 12000);

-- 12. Students (20 students across various classes)
INSERT INTO students (id, school_id, admission_number, student_id_code, first_name, last_name, date_of_birth, gender, blood_group, admission_date, academic_year_id, class_id, section_id, roll_number, status) VALUES
    ('st000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-001', 'STD-001', 'Arif', 'Rahman', '2018-03-15', 'male', 'B+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000005', 1, 'active'),
    ('st000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-002', 'STD-002', 'Nusrat', 'Jahan', '2018-07-22', 'female', 'A+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000005', 2, 'active'),
    ('st000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-003', 'STD-003', 'Tanvir', 'Hasan', '2018-01-10', 'male', 'O+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000005', 3, 'active'),
    ('st000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-004', 'STD-004', 'Mim', 'Akter', '2018-11-05', 'female', 'AB+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000006', 1, 'active'),
    ('st000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-005', 'STD-005', 'Sakib', 'Islam', '2017-09-18', 'male', 'A-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 's0000000-0000-0000-0000-000000000007', 1, 'active'),
    ('st000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-006', 'STD-006', 'Tasnia', 'Rahman', '2017-04-25', 'female', 'B+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 's0000000-0000-0000-0000-000000000007', 2, 'active'),
    ('st000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-007', 'STD-007', 'Mehedi', 'Haque', '2019-06-12', 'male', 'O-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000004', 1, 'active'),
    ('st000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-008', 'STD-008', 'Riya', 'Sultana', '2019-02-28', 'female', 'A+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000004', 2, 'active'),
    ('st000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-009', 'STD-009', 'Fahim', 'Chowdhury', '2020-08-08', 'male', 'B-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000002', 1, 'active'),
    ('st000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-010', 'STD-010', 'Lamia', 'Hossain', '2020-12-20', 'female', 'AB-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000002', 2, 'active'),
    ('st000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-011', 'STD-011', 'Rayhan', 'Khan', '2017-05-14', 'male', 'A+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 's0000000-0000-0000-0000-000000000008', 1, 'active'),
    ('st000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-012', 'STD-012', 'Sadia', 'Afrin', '2017-10-30', 'female', 'O+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 's0000000-0000-0000-0000-000000000008', 2, 'active'),
    ('st000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-013', 'STD-013', 'Imran', 'Hossain', '2018-08-03', 'male', 'B+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000005', 4, 'active'),
    ('st000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-014', 'STD-014', 'Farzana', 'Yasmin', '2019-01-17', 'female', 'A-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 's0000000-0000-0000-0000-000000000004', 3, 'active'),
    ('st000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-015', 'STD-015', 'Naeem', 'Uddin', '2020-05-22', 'male', 'O+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000003', 1, 'active'),
    ('st000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-016', 'STD-016', 'Tamanna', 'Akhter', '2021-03-11', 'female', 'B-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 1, 'active'),
    ('st000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-017', 'STD-017', 'Jubayer', 'Ahmed', '2021-07-09', 'male', 'AB+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001', 2, 'active'),
    ('st000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-018', 'STD-018', 'Sharmin', 'Nahar', '2018-04-19', 'female', 'A+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000006', 2, 'active'),
    ('st000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-019', 'STD-019', 'Habib', 'Sarker', '2017-12-01', 'male', 'O-', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 's0000000-0000-0000-0000-000000000007', 3, 'active'),
    ('st000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'ADM-2026-020', 'STD-020', 'Anika', 'Islam', '2020-09-14', 'female', 'B+', '2026-01-05', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000003', 2, 'active');

-- 13. Guardians (for first few students)
INSERT INTO student_guardians (student_id, relation, name, phone, email, occupation, is_primary) VALUES
    ('st000000-0000-0000-0000-000000000001', 'father', 'Mizanur Rahman', '+880-1711100001', 'mizanur@gmail.com', 'Businessman', true),
    ('st000000-0000-0000-0000-000000000001', 'mother', 'Rehana Rahman', '+880-1711100002', NULL, 'Homemaker', false),
    ('st000000-0000-0000-0000-000000000002', 'father', 'Zahidul Jahan', '+880-1711100003', 'zahidul@gmail.com', 'Engineer', true),
    ('st000000-0000-0000-0000-000000000003', 'father', 'Mofizul Hasan', '+880-1711100004', NULL, 'Teacher', true),
    ('st000000-0000-0000-0000-000000000004', 'father', 'Shafiqul Akter', '+880-1711100005', 'shafiq@gmail.com', 'Doctor', true),
    ('st000000-0000-0000-0000-000000000005', 'father', 'Nurul Islam', '+880-1711100006', NULL, 'Farmer', true);

-- 14. Grade Scale
INSERT INTO grade_scales (school_id, name, min_percentage, max_percentage, grade, grade_point) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'A+', 80, 100, 'A+', 5.00),
    ('550e8400-e29b-41d4-a716-446655440000', 'A', 70, 79.99, 'A', 4.00),
    ('550e8400-e29b-41d4-a716-446655440000', 'A-', 60, 69.99, 'A-', 3.50),
    ('550e8400-e29b-41d4-a716-446655440000', 'B', 50, 59.99, 'B', 3.00),
    ('550e8400-e29b-41d4-a716-446655440000', 'C', 40, 49.99, 'C', 2.00),
    ('550e8400-e29b-41d4-a716-446655440000', 'D', 33, 39.99, 'D', 1.00),
    ('550e8400-e29b-41d4-a716-446655440000', 'F', 0, 32.99, 'F', 0.00);

-- 15. Fee Types
INSERT INTO fee_types (id, school_id, name, code) VALUES
    ('ft000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'Admission Fee', 'ADM'),
    ('ft000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'Tuition Fee', 'TUI'),
    ('ft000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'Monthly Fee', 'MON'),
    ('ft000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'Exam Fee', 'EXM'),
    ('ft000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'Transport Fee', 'TRN'),
    ('ft000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'Activity Fee', 'ACT'),
    ('ft000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'Library Fee', 'LIB');

-- 16. Fee Structures
INSERT INTO fee_structures (school_id, academic_year_id, class_id, fee_type_id, amount, frequency, due_day) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'ft000000-0000-0000-0000-000000000003', 2000, 'monthly', 10),
    ('550e8400-e29b-41d4-a716-446655440000', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'ft000000-0000-0000-0000-000000000003', 2500, 'monthly', 10),
    ('550e8400-e29b-41d4-a716-446655440000', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'ft000000-0000-0000-0000-000000000003', 3000, 'monthly', 10),
    ('550e8400-e29b-41d4-a716-446655440000', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 'ft000000-0000-0000-0000-000000000003', 3500, 'monthly', 10),
    ('550e8400-e29b-41d4-a716-446655440000', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 'ft000000-0000-0000-0000-000000000003', 4000, 'monthly', 10),
    ('550e8400-e29b-41d4-a716-446655440000', 'ay000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 'ft000000-0000-0000-0000-000000000003', 4500, 'monthly', 10);

-- 17. Settings
INSERT INTO settings (school_id, category, key, value) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'general', 'currency', '"BDT"'),
    ('550e8400-e29b-41d4-a716-446655440000', 'general', 'currency_symbol', '"৳"'),
    ('550e8400-e29b-41d4-a716-446655440000', 'general', 'date_format', '"DD/MM/YYYY"'),
    ('550e8400-e29b-41d4-a716-446655440000', 'finance', 'invoice_prefix', '"INV"'),
    ('550e8400-e29b-41d4-a716-446655440000', 'finance', 'receipt_prefix', '"RCT"'),
    ('550e8400-e29b-41d4-a716-446655440000', 'exam', 'grading_system', '"gpa"'),
    ('550e8400-e29b-41d4-a716-446655440000', 'exam', 'max_gpa', '5.00');

-- =============================================
-- School Management System — PostgreSQL Schema
-- =============================================
-- All tables use UUID primary keys, timestamps,
-- and soft-delete where appropriate.
-- Multi-school ready via school_id FK.
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated', 'transferred', 'suspended', 'withdrawn');
CREATE TYPE staff_status AS ENUM ('active', 'inactive', 'terminated', 'resigned', 'retired');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'temporary');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'leave', 'excused');
CREATE TYPE exam_type AS ENUM ('class_test', 'monthly_test', 'mid_term', 'final_exam', 'assessment', 'term_exam');
CREATE TYPE exam_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE fee_frequency AS ENUM ('one_time', 'monthly', 'quarterly', 'semi_annual', 'annual');
CREATE TYPE invoice_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'bank', 'card', 'mobile_banking', 'other');
CREATE TYPE payroll_status AS ENUM ('draft', 'processed', 'approved', 'paid');
CREATE TYPE admission_type AS ENUM ('new', 'transfer', 'readmission');
CREATE TYPE subject_type AS ENUM ('theory', 'practical', 'both');
CREATE TYPE day_of_week AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- =============================================
-- CORE: SCHOOLS
-- =============================================

CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Bangladesh',
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    principal_name VARCHAR(255),
    established_year INT,
    registration_number VARCHAR(100),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUTH & RBAC
-- =============================================

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module, action)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    supabase_auth_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, email)
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- =============================================
-- ACADEMICS
-- =============================================

CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name),
    CHECK (end_date > start_date)
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    numeric_order INT NOT NULL DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, name)
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    subject_type subject_type DEFAULT 'theory',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_sections_class_id ON sections(class_id);
CREATE INDEX idx_subjects_school_id ON subjects(school_id);

-- =============================================
-- STUDENTS
-- =============================================

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    admission_number VARCHAR(50) NOT NULL,
    student_id_code VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    blood_group VARCHAR(5),
    nationality VARCHAR(50) DEFAULT 'Bangladeshi',
    religion VARCHAR(50),
    photo_url TEXT,
    birth_cert_number VARCHAR(100),
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    academic_year_id UUID REFERENCES academic_years(id),
    class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    roll_number INT,
    admission_type admission_type DEFAULT 'new',
    previous_school VARCHAR(255),
    address TEXT,
    status student_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(school_id, admission_number)
);

CREATE TABLE student_guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relation VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    occupation VARCHAR(100),
    emergency_contact BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    roll_number INT,
    result_status VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_section_id ON students(section_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_deleted_at ON students(deleted_at);
CREATE INDEX idx_student_guardians_student_id ON student_guardians(student_id);

-- =============================================
-- TEACHERS
-- =============================================

CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_id_code VARCHAR(50) NOT NULL,
    teacher_id_code VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    gender gender_type,
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    employment_type employment_type DEFAULT 'full_time',
    department VARCHAR(100),
    designation VARCHAR(100),
    salary DECIMAL(12,2) DEFAULT 0,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    emergency_contact VARCHAR(20),
    status staff_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(school_id, employee_id_code)
);

CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_teachers_status ON teachers(status);

-- =============================================
-- EMPLOYEES (non-teaching)
-- =============================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    employee_id_code VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    gender gender_type,
    date_of_birth DATE,
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    employment_type employment_type DEFAULT 'full_time',
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    salary DECIMAL(12,2) DEFAULT 0,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    emergency_contact VARCHAR(20),
    status staff_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(school_id, employee_id_code)
);

CREATE TABLE employee_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('teacher', 'employee')),
    entity_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employees_school_id ON employees(school_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employee_documents_entity ON employee_documents(entity_type, entity_id);

-- =============================================
-- COURSE ASSIGNMENTS
-- =============================================

CREATE TABLE course_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    weekly_periods INT DEFAULT 1,
    room VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(academic_year_id, class_id, section_id, subject_id)
);

CREATE INDEX idx_course_assignments_teacher ON course_assignments(teacher_id);

-- =============================================
-- CLASS ROUTINES (TIMETABLE)
-- =============================================

CREATE TABLE class_routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    day_of_week day_of_week NOT NULL,
    period_number INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES teachers(id),
    room VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(academic_year_id, class_id, section_id, day_of_week, period_number),
    CHECK (end_time > start_time)
);

-- =============================================
-- ATTENDANCE
-- =============================================

CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    remarks TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

CREATE TABLE teacher_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    check_in TIME,
    check_out TIME,
    remarks TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, date)
);

CREATE TABLE employee_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    check_in TIME,
    check_out TIME,
    remarks TEXT,
    marked_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_student_attendance_student ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_class ON student_attendance(class_id, section_id, date);
CREATE INDEX idx_teacher_attendance_date ON teacher_attendance(date);
CREATE INDEX idx_employee_attendance_date ON employee_attendance(date);

-- =============================================
-- EXAMINATIONS
-- =============================================

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    name VARCHAR(255) NOT NULL,
    exam_type exam_type NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status exam_status DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    total_marks DECIMAL(6,2) NOT NULL DEFAULT 100,
    pass_marks DECIMAL(6,2) NOT NULL DEFAULT 33,
    room VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_subject_id UUID NOT NULL REFERENCES exam_subjects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    written_marks DECIMAL(6,2) DEFAULT 0,
    mcq_marks DECIMAL(6,2) DEFAULT 0,
    practical_marks DECIMAL(6,2) DEFAULT 0,
    oral_marks DECIMAL(6,2) DEFAULT 0,
    total_marks DECIMAL(6,2) DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0,
    grade VARCHAR(5),
    grade_point DECIMAL(3,2) DEFAULT 0,
    remarks TEXT,
    entered_by UUID REFERENCES users(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_subject_id, student_id)
);

CREATE TABLE grade_scales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    min_percentage DECIMAL(5,2) NOT NULL,
    max_percentage DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point DECIMAL(3,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (max_percentage >= min_percentage)
);

CREATE INDEX idx_exams_school ON exams(school_id);
CREATE INDEX idx_exam_subjects_exam ON exam_subjects(exam_id);
CREATE INDEX idx_student_marks_student ON student_marks(student_id);
CREATE INDEX idx_student_marks_exam_subject ON student_marks(exam_subject_id);

-- =============================================
-- FINANCE
-- =============================================

CREATE TABLE fee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    fee_type_id UUID NOT NULL REFERENCES fee_types(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    frequency fee_frequency DEFAULT 'monthly',
    due_day INT DEFAULT 10 CHECK (due_day >= 1 AND due_day <= 28),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_fee_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id),
    discount_amount DECIMAL(12,2) DEFAULT 0 CHECK (discount_amount >= 0),
    discount_reason TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, fee_structure_id)
);

CREATE TABLE fee_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    fee_structure_id UUID REFERENCES fee_structures(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    discount DECIMAL(12,2) DEFAULT 0 CHECK (discount >= 0),
    net_amount DECIMAL(12,2) NOT NULL CHECK (net_amount >= 0),
    paid_amount DECIMAL(12,2) DEFAULT 0 CHECK (paid_amount >= 0),
    due_amount DECIMAL(12,2) GENERATED ALWAYS AS (net_amount - paid_amount) STORED,
    due_date DATE,
    status invoice_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, invoice_number)
);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES fee_invoices(id),
    student_id UUID NOT NULL REFERENCES students(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method NOT NULL DEFAULT 'cash',
    transaction_ref VARCHAR(100),
    receipt_number VARCHAR(50) NOT NULL,
    paid_date DATE NOT NULL DEFAULT CURRENT_DATE,
    collected_by UUID REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, receipt_number)
);

CREATE TABLE fee_refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES fee_payments(id),
    student_id UUID NOT NULL REFERENCES students(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    refunded_by UUID REFERENCES users(id),
    refund_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fee_invoices_student ON fee_invoices(student_id);
CREATE INDEX idx_fee_invoices_status ON fee_invoices(status);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_invoice ON fee_payments(invoice_id);

-- =============================================
-- PAYROLL
-- =============================================

CREATE TABLE salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL,
    employee_type VARCHAR(20) NOT NULL CHECK (employee_type IN ('teacher', 'employee')),
    basic_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    house_allowance DECIMAL(12,2) DEFAULT 0,
    medical_allowance DECIMAL(12,2) DEFAULT 0,
    transport_allowance DECIMAL(12,2) DEFAULT 0,
    other_allowance DECIMAL(12,2) DEFAULT 0,
    tax_deduction DECIMAL(12,2) DEFAULT 0,
    loan_deduction DECIMAL(12,2) DEFAULT 0,
    advance_deduction DECIMAL(12,2) DEFAULT 0,
    other_deduction DECIMAL(12,2) DEFAULT 0,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL,
    employee_type VARCHAR(20) NOT NULL CHECK (employee_type IN ('teacher', 'employee')),
    salary_structure_id UUID REFERENCES salary_structures(id),
    pay_period_month INT NOT NULL CHECK (pay_period_month >= 1 AND pay_period_month <= 12),
    pay_period_year INT NOT NULL,
    gross_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_deductions DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    status payroll_status DEFAULT 'draft',
    processed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    paid_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, employee_type, pay_period_month, pay_period_year)
);

CREATE TABLE payroll_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('earning', 'deduction')),
    item_name VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payrolls_employee ON payrolls(employee_id, employee_type);
CREATE INDEX idx_payrolls_period ON payrolls(pay_period_year, pay_period_month);

-- =============================================
-- DOCUMENTS
-- =============================================

CREATE TABLE admit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id),
    student_id UUID NOT NULL REFERENCES students(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),
    generated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

CREATE TABLE student_id_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    generated_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- =============================================
-- AUDIT LOGS
-- =============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_school ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =============================================
-- SETTINGS
-- =============================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, category, key)
);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t);
    END LOOP;
END;
$$;

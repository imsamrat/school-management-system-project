-- Migration: 004_expense_management.sql

-- =============================================
-- EXPENSE MANAGEMENT
-- =============================================

CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recorded_by UUID REFERENCES users(id),
    receipt_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);

-- Insert default categories for the default school
DO $$
DECLARE
    default_school_id UUID;
BEGIN
    SELECT id INTO default_school_id FROM schools LIMIT 1;
    IF default_school_id IS NOT NULL THEN
        INSERT INTO expense_categories (school_id, name, description) VALUES
            (default_school_id, 'Utilities', 'Electricity, water, gas, internet bills'),
            (default_school_id, 'Salary', 'Staff and teacher salaries'),
            (default_school_id, 'Maintenance', 'Building and equipment maintenance'),
            (default_school_id, 'Supplies', 'Stationery and office supplies'),
            (default_school_id, 'Miscellaneous', 'Other unexpected expenses')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

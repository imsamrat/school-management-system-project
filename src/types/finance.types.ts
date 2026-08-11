export interface FeeStructure {
  id: string;
  class_id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one-time';
}

export interface Invoice {
  id: string;
  student_id: string;
  title: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'partial';
  due_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  student_id: string;
  amount: number;
  payment_method: 'cash' | 'bank' | 'card' | 'mobile_banking' | 'other';
  transaction_ref?: string;
  receipt_number: string;
  paid_date: string;
  created_at?: string;
}

export interface ExpenseCategory {
  id: string;
  school_id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Expense {
  id: string;
  school_id: string;
  category_id: string;
  category_name?: string;
  amount: number;
  expense_date: string;
  title: string;
  description?: string;
  receipt_url?: string;
  recorded_by?: string;
  created_at?: string;
}

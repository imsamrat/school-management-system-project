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
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'cheque';
  reference_number?: string;
  payment_date: string;
}

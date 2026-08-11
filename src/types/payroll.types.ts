export interface SalaryStructure {
  id: string;
  user_id: string;
  user_type: 'teacher' | 'employee';
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
}

export interface PayrollRecord {
  id: string;
  user_id: string;
  user_type: 'teacher' | 'employee';
  month: string; // YYYY-MM
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'pending' | 'processed' | 'paid';
  payment_date?: string;
}

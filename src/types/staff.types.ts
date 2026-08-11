export type StaffRole = 'teacher' | 'employee' | 'all';
export type StaffStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'visiting';

export interface Staff {
  id: string;
  school_id: string;
  user_id?: string;
  employee_id_code: string;
  teacher_id_code?: string;
  is_teacher: boolean;

  // Personal
  first_name: string;
  last_name: string;
  photo_url?: string;
  gender?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: string;

  // Employment
  joining_date?: string;
  employment_type?: EmploymentType;
  department?: string;
  designation?: string;
  salary?: number;
  bank_name?: string;
  bank_account?: string;
  status: StaffStatus;

  // Teaching-specific (only relevant if is_teacher = true)
  qualification?: string;
  specialization?: string;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Re-export as legacy types for backwards compatibility
export type Teacher = Staff;
export type Employee = Staff;

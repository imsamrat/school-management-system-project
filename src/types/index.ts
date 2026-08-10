// ==========================================
// Common Types
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SelectOption {
  label: string;
  value: string;
}

// ==========================================
// Auth Types
// ==========================================

export interface User {
  id: string;
  schoolId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  roles: Role[];
  permissions: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  description?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==========================================
// School Types
// ==========================================

export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  establishedYear?: number;
  registrationNumber?: string;
  settings?: Record<string, unknown>;
}

// ==========================================
// Student Types
// ==========================================

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended' | 'withdrawn';
export type Gender = 'male' | 'female' | 'other';
export type AdmissionType = 'new' | 'transfer' | 'readmission';

export interface Student {
  id: string;
  schoolId: string;
  admissionNumber: string;
  studentIdCode?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: string;
  nationality?: string;
  religion?: string;
  photoUrl?: string;
  birthCertNumber?: string;
  admissionDate: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  rollNumber?: number;
  admissionType?: AdmissionType;
  previousSchool?: string;
  address?: string;
  status: StudentStatus;
  className?: string;
  sectionName?: string;
  academicYearName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentGuardian {
  id: string;
  studentId: string;
  relation: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  occupation?: string;
  emergencyContact: boolean;
  isPrimary: boolean;
}

// ==========================================
// Teacher Types
// ==========================================

export type StaffStatus = 'active' | 'inactive' | 'terminated' | 'resigned' | 'retired';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary';

export interface Teacher {
  id: string;
  schoolId: string;
  employeeIdCode: string;
  teacherIdCode?: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  qualification?: string;
  specialization?: string;
  joiningDate: string;
  employmentType?: EmploymentType;
  department?: string;
  designation?: string;
  salary?: number;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Employee Types
// ==========================================

export interface Employee {
  id: string;
  schoolId: string;
  employeeIdCode: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  gender?: Gender;
  dateOfBirth?: string;
  department?: string;
  designation?: string;
  joiningDate: string;
  employmentType?: EmploymentType;
  phone?: string;
  email?: string;
  address?: string;
  salary?: number;
  bankName?: string;
  bankAccount?: string;
  emergencyContact?: string;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Academic Types
// ==========================================

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  numericOrder: number;
  description?: string;
  isActive: boolean;
  sections?: Section[];
}

export interface Section {
  id: string;
  classId: string;
  name: string;
  capacity: number;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code?: string;
  subjectType: 'theory' | 'practical' | 'both';
  description?: string;
  isActive: boolean;
}

// ==========================================
// Attendance Types
// ==========================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'excused';

export interface StudentAttendance {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  studentName?: string;
  rollNumber?: number;
}

// ==========================================
// Exam Types
// ==========================================

export type ExamType = 'class_test' | 'monthly_test' | 'mid_term' | 'final_exam' | 'assessment' | 'term_exam';
export type ExamStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Exam {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string;
  examType: ExamType;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: ExamStatus;
}

// ==========================================
// Finance Types
// ==========================================

export type InvoiceStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank' | 'card' | 'mobile_banking' | 'other';

export interface FeeType {
  id: string;
  schoolId: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  amount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate?: string;
  status: InvoiceStatus;
  studentName?: string;
  className?: string;
}

// ==========================================
// Payroll Types
// ==========================================

export type PayrollStatus = 'draft' | 'processed' | 'approved' | 'paid';

export interface Payroll {
  id: string;
  employeeId: string;
  employeeType: 'teacher' | 'employee';
  payPeriodMonth: number;
  payPeriodYear: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  employeeName?: string;
}

// ==========================================
// Dashboard Types
// ==========================================

export interface DashboardStats {
  totalStudents: number;
  activeTeachers: number;
  totalEmployees: number;
  todayAttendancePercent: number;
  pendingFees: number;
  todayCollection: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  upcomingExams: number;
  pendingAdmissions: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ==========================================
// Notification Types
// ==========================================

export interface Notification {
  id: string;
  title: string;
  message?: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

// ==========================================
// Audit Log Types
// ==========================================

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

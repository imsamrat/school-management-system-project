export const API_BASE_URL = '/api';

export const SCHOOL_ID = '550e8400-e29b-41d4-a716-446655440000'; // Demo school

export const ITEMS_PER_PAGE = 20;

export const STUDENT_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Graduated', value: 'graduated' },
  { label: 'Transferred', value: 'transferred' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Withdrawn', value: 'withdrawn' },
] as const;

export const STAFF_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Terminated', value: 'terminated' },
  { label: 'Resigned', value: 'resigned' },
  { label: 'Retired', value: 'retired' },
] as const;

export const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
] as const;

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const;

export const ATTENDANCE_STATUSES = [
  { label: 'Present', value: 'present', color: 'bg-green-500' },
  { label: 'Absent', value: 'absent', color: 'bg-red-500' },
  { label: 'Late', value: 'late', color: 'bg-amber-500' },
  { label: 'Leave', value: 'leave', color: 'bg-gray-400' },
  { label: 'Excused', value: 'excused', color: 'bg-blue-400' },
] as const;

export const PAYMENT_METHODS = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Transfer', value: 'bank' },
  { label: 'Card', value: 'card' },
  { label: 'Mobile Banking', value: 'mobile_banking' },
  { label: 'Other', value: 'other' },
] as const;

export const EXAM_TYPES = [
  { label: 'Class Test', value: 'class_test' },
  { label: 'Monthly Test', value: 'monthly_test' },
  { label: 'Mid Term', value: 'mid_term' },
  { label: 'Final Exam', value: 'final_exam' },
  { label: 'Assessment', value: 'assessment' },
  { label: 'Term Exam', value: 'term_exam' },
] as const;

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave' | 'excused';
  student_id?: string;
  teacher_id?: string;
  employee_id?: string;
}

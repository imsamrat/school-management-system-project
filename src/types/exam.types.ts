export interface Exam {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ExamSchedule {
  id: string;
  exam_id: string;
  class_id: string;
  subject_id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  total_marks: number;
  pass_marks: number;
}

export interface StudentMark {
  id: string;
  exam_id: string;
  subject_id: string;
  student_id: string;
  marks_obtained: number;
  grade: string;
  remarks?: string;
}

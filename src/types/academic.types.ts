export interface Class {
  id: string;
  name: string;
  numeric_order: number;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
  capacity: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  subject_type: 'theory' | 'practical';
}

export interface CourseAssignment {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  employee_id: string;
}

export interface ClassRoutine {
  id: string;
  class_id: string;
  section_id: string;
  day_of_week: string;
  period_number: number;
  start_time: string;
  end_time: string;
  subject_id: string;
  employee_id: string;
}

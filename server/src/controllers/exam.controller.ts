import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let exams = [
  { id: 'ex1', name: 'Mid-Term Examination', start_date: '2026-10-15', end_date: '2026-10-25', status: 'upcoming' },
];

let examSchedules = [
  { id: 'es1', exam_id: 'ex1', class_id: 'c1', subject_id: 'sub1', exam_date: '2026-10-15', start_time: '10:00', end_time: '12:00', total_marks: 100, pass_marks: 40 },
];

let studentMarks = [
  { id: 'sm1', exam_id: 'ex1', subject_id: 'sub1', student_id: 's001', marks_obtained: 85, grade: 'A', remarks: 'Excellent' },
];

// Exams
export const getExams = async (req: Request, res: Response) => sendSuccess(res, exams);
export const createExam = async (req: Request, res: Response) => {
  const newExam = { id: `ex${exams.length + 1}`, ...req.body };
  exams.push(newExam);
  return sendSuccess(res, newExam, 'Exam created', 201);
};
export const updateExam = async (req: Request, res: Response) => {
  const index = exams.findIndex(e => e.id === req.params.id);
  if (index === -1) return sendError(res, 'Exam not found', 404);
  exams[index] = { ...exams[index], ...req.body };
  return sendSuccess(res, exams[index], 'Exam updated');
};

// Exam Schedules
export const getExamSchedules = async (req: Request, res: Response) => {
  const { exam_id } = req.query;
  const filtered = exam_id ? examSchedules.filter(es => es.exam_id === exam_id) : examSchedules;
  return sendSuccess(res, filtered);
};
export const createExamSchedule = async (req: Request, res: Response) => {
  const newSchedule = { id: `es${examSchedules.length + 1}`, ...req.body };
  examSchedules.push(newSchedule);
  return sendSuccess(res, newSchedule, 'Schedule created', 201);
};

// Marks
export const getMarks = async (req: Request, res: Response) => {
  const { exam_id, subject_id, student_id } = req.query;
  let filtered = studentMarks;
  if (exam_id) filtered = filtered.filter(sm => sm.exam_id === exam_id);
  if (subject_id) filtered = filtered.filter(sm => sm.subject_id === subject_id);
  if (student_id) filtered = filtered.filter(sm => sm.student_id === student_id);
  return sendSuccess(res, filtered);
};

export const saveMarks = async (req: Request, res: Response) => {
  const { exam_id, subject_id, marks } = req.body;
  if (!exam_id || !subject_id || !Array.isArray(marks)) {
    return sendError(res, 'Invalid marks data', 400);
  }

  marks.forEach(markRecord => {
    const existingIndex = studentMarks.findIndex(sm => 
      sm.exam_id === exam_id && sm.subject_id === subject_id && sm.student_id === markRecord.student_id
    );

    let grade = 'F';
    if (markRecord.marks_obtained >= 90) grade = 'A+';
    else if (markRecord.marks_obtained >= 80) grade = 'A';
    else if (markRecord.marks_obtained >= 70) grade = 'B';
    else if (markRecord.marks_obtained >= 60) grade = 'C';
    else if (markRecord.marks_obtained >= 40) grade = 'D';

    const newMark = {
      exam_id,
      subject_id,
      student_id: markRecord.student_id,
      marks_obtained: markRecord.marks_obtained,
      remarks: markRecord.remarks || '',
      grade
    };

    if (existingIndex > -1) {
      studentMarks[existingIndex] = { ...studentMarks[existingIndex], ...newMark };
    } else {
      studentMarks.push({ id: `sm${studentMarks.length + 1}`, ...newMark });
    }
  });

  return sendSuccess(res, null, 'Marks saved successfully', 201);
};

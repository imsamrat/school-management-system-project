import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let academicYears = [
  { id: 'ay1', name: '2026-2027', start_date: '2026-04-01', end_date: '2027-03-31', is_current: true },
];

let classes = [
  { id: 'c1', name: 'Class 1', numeric_order: 1 },
  { id: 'c2', name: 'Class 2', numeric_order: 2 },
];

let sections = [
  { id: 'sec1', class_id: 'c1', name: 'A', capacity: 30 },
  { id: 'sec2', class_id: 'c1', name: 'B', capacity: 30 },
];

let subjects = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH101', subject_type: 'theory' },
  { id: 'sub2', name: 'Science', code: 'SCI101', subject_type: 'theory' },
];

// Classes
export const getClasses = async (req: Request, res: Response) => sendSuccess(res, classes);
export const createClass = async (req: Request, res: Response) => {
  const newClass = { id: `c${classes.length + 1}`, ...req.body };
  classes.push(newClass);
  return sendSuccess(res, newClass, 'Class created', 201);
};
export const updateClass = async (req: Request, res: Response) => {
  const index = classes.findIndex(c => c.id === req.params.id);
  if (index === -1) return sendError(res, 'Class not found', 404);
  classes[index] = { ...classes[index], ...req.body };
  return sendSuccess(res, classes[index], 'Class updated');
};

// Sections
export const getSections = async (req: Request, res: Response) => sendSuccess(res, sections);
export const createSection = async (req: Request, res: Response) => {
  const newSection = { id: `sec${sections.length + 1}`, ...req.body };
  sections.push(newSection);
  return sendSuccess(res, newSection, 'Section created', 201);
};

// Subjects
export const getSubjects = async (req: Request, res: Response) => sendSuccess(res, subjects);
export const createSubject = async (req: Request, res: Response) => {
  const newSubject = { id: `sub${subjects.length + 1}`, ...req.body };
  subjects.push(newSubject);
  return sendSuccess(res, newSubject, 'Subject created', 201);
};

// Advanced Academics: Course Assignments
let courseAssignments = [
  { id: 'ca1', class_id: 'c1', section_id: 'sec1', subject_id: 'sub1', teacher_id: 't001' }
];

export const getCourseAssignments = async (req: Request, res: Response) => sendSuccess(res, courseAssignments);
export const createCourseAssignment = async (req: Request, res: Response) => {
  const newAssignment = { id: `ca${courseAssignments.length + 1}`, ...req.body };
  courseAssignments.push(newAssignment);
  return sendSuccess(res, newAssignment, 'Assignment created', 201);
};

// Advanced Academics: Class Routines
let classRoutines = [
  { id: 'cr1', class_id: 'c1', section_id: 'sec1', day_of_week: 'Monday', period_number: 1, start_time: '08:00', end_time: '08:45', subject_id: 'sub1', teacher_id: 't001' }
];

export const getClassRoutines = async (req: Request, res: Response) => sendSuccess(res, classRoutines);
export const createClassRoutine = async (req: Request, res: Response) => {
  const newRoutine = { id: `cr${classRoutines.length + 1}`, ...req.body };
  classRoutines.push(newRoutine);
  return sendSuccess(res, newRoutine, 'Routine created', 201);
};

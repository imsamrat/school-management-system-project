import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let studentAttendance = [
  { id: 'sa1', student_id: 's001', date: '2026-08-10', status: 'present' },
];

let teacherAttendance = [
  { id: 'ta1', teacher_id: 't001', date: '2026-08-10', status: 'present' },
];

let employeeAttendance = [
  { id: 'ea1', employee_id: 'e001', date: '2026-08-10', status: 'present' },
];

// Student Attendance
export const getStudentAttendance = async (req: Request, res: Response) => {
  const { date, class_id, section_id } = req.query;
  // Normally filter by date, class, section. For mock, just return all.
  return sendSuccess(res, studentAttendance);
};

export const markStudentAttendance = async (req: Request, res: Response) => {
  const { date, records } = req.body;
  // records: { student_id, status }[]
  if (!date || !records || !Array.isArray(records)) {
    return sendError(res, 'Invalid attendance data', 400);
  }

  // Very naive mock update
  records.forEach((record) => {
    const existingIndex = studentAttendance.findIndex(a => a.student_id === record.student_id && a.date === date);
    if (existingIndex > -1) {
      studentAttendance[existingIndex].status = record.status;
    } else {
      studentAttendance.push({
        id: `sa${studentAttendance.length + 1}`,
        student_id: record.student_id,
        date: date,
        status: record.status,
      });
    }
  });

  return sendSuccess(res, null, 'Attendance marked successfully', 201);
};

// Teacher Attendance
export const getTeacherAttendance = async (req: Request, res: Response) => {
  return sendSuccess(res, teacherAttendance);
};

export const markTeacherAttendance = async (req: Request, res: Response) => {
  const { date, records } = req.body;
  if (!date || !records || !Array.isArray(records)) {
    return sendError(res, 'Invalid attendance data', 400);
  }

  records.forEach((record) => {
    const existingIndex = teacherAttendance.findIndex(a => a.teacher_id === record.teacher_id && a.date === date);
    if (existingIndex > -1) {
      teacherAttendance[existingIndex].status = record.status;
    } else {
      teacherAttendance.push({
        id: `ta${teacherAttendance.length + 1}`,
        teacher_id: record.teacher_id,
        date: date,
        status: record.status,
      });
    }
  });

  return sendSuccess(res, null, 'Attendance marked successfully', 201);
};

// Employee Attendance
export const getEmployeeAttendance = async (req: Request, res: Response) => {
  return sendSuccess(res, employeeAttendance);
};

export const markEmployeeAttendance = async (req: Request, res: Response) => {
  const { date, records } = req.body;
  if (!date || !records || !Array.isArray(records)) {
    return sendError(res, 'Invalid attendance data', 400);
  }

  records.forEach((record) => {
    const existingIndex = employeeAttendance.findIndex(a => a.employee_id === record.employee_id && a.date === date);
    if (existingIndex > -1) {
      employeeAttendance[existingIndex].status = record.status;
    } else {
      employeeAttendance.push({
        id: `ea${employeeAttendance.length + 1}`,
        employee_id: record.employee_id,
        date: date,
        status: record.status,
      });
    }
  });

  return sendSuccess(res, null, 'Attendance marked successfully', 201);
};

import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

// In-memory mock data
let teachers = [
  {
    id: 't001',
    teacher_id_code: 'TCH-001',
    first_name: 'Robert',
    last_name: 'Brown',
    gender: 'male',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    status: 'active',
  },
  {
    id: 't002',
    teacher_id_code: 'TCH-002',
    first_name: 'Sarah',
    last_name: 'Wilson',
    gender: 'female',
    department: 'Science',
    designation: 'Teacher',
    status: 'active',
  },
];

export const getTeachers = async (req: Request, res: Response) => {
  const { q } = req.query;
  let result = teachers;

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    result = teachers.filter(
      (t) =>
        t.first_name.toLowerCase().includes(query) ||
        t.last_name.toLowerCase().includes(query) ||
        t.teacher_id_code.toLowerCase().includes(query)
    );
  }

  return sendSuccess(res, result);
};

export const getTeacherById = async (req: Request, res: Response) => {
  const teacher = teachers.find((t) => t.id === req.params.id);
  if (!teacher) {
    return sendError(res, 'Teacher not found', 404);
  }
  return sendSuccess(res, teacher);
};

export const createTeacher = async (req: Request, res: Response) => {
  const newTeacher = {
    id: `t00${teachers.length + 1}`,
    ...req.body,
    status: 'active',
  };
  teachers.push(newTeacher);
  return sendSuccess(res, newTeacher, 'Teacher created successfully', 201);
};

export const updateTeacher = async (req: Request, res: Response) => {
  const index = teachers.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return sendError(res, 'Teacher not found', 404);
  }

  teachers[index] = { ...teachers[index], ...req.body };
  return sendSuccess(res, teachers[index], 'Teacher updated successfully');
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const index = teachers.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return sendError(res, 'Teacher not found', 404);
  }

  teachers[index].status = 'terminated';
  return sendSuccess(res, null, 'Teacher deleted successfully');
};

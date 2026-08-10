import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

// In-memory mock data
let students = [
  {
    id: 's001',
    admission_number: 'ADM-2024-001',
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
    class_id: 'c1',
    section_id: 'sec1',
    roll_number: '10',
    status: 'active',
  },
  {
    id: 's002',
    admission_number: 'ADM-2024-002',
    first_name: 'Jane',
    last_name: 'Smith',
    gender: 'female',
    class_id: 'c1',
    section_id: 'sec2',
    roll_number: '12',
    status: 'active',
  },
];

export const getStudents = async (req: Request, res: Response) => {
  // Mock search/filter
  const { q } = req.query;
  let result = students;

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    result = students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(query) ||
        s.last_name.toLowerCase().includes(query) ||
        s.admission_number.toLowerCase().includes(query)
    );
  }

  return sendSuccess(res, result);
};

export const getStudentById = async (req: Request, res: Response) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) {
    return sendError(res, 'Student not found', 404);
  }
  return sendSuccess(res, student);
};

export const createStudent = async (req: Request, res: Response) => {
  const newStudent = {
    id: `s00${students.length + 1}`,
    ...req.body,
    status: 'active',
  };
  students.push(newStudent);
  return sendSuccess(res, newStudent, 'Student created successfully', 201);
};

export const updateStudent = async (req: Request, res: Response) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return sendError(res, 'Student not found', 404);
  }

  students[index] = { ...students[index], ...req.body };
  return sendSuccess(res, students[index], 'Student updated successfully');
};

export const deleteStudent = async (req: Request, res: Response) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return sendError(res, 'Student not found', 404);
  }

  // Soft delete logic mockup
  students[index].status = 'withdrawn';
  return sendSuccess(res, null, 'Student deleted successfully');
};

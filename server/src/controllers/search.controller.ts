import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

// In a real scenario, these would query the actual DB models.
// We will mock search results based on the query.
const mockStudents = [
  { id: 's001', type: 'Student', title: 'Samrat', subtitle: 'Class 10 - STU001', link: '/students/s001' },
  { id: 's002', type: 'Student', title: 'Alice', subtitle: 'Class 9 - STU002', link: '/students/s002' },
];

const mockTeachers = [
  { id: 't001', type: 'Teacher', title: 'John Doe', subtitle: 'Mathematics - TCH001', link: '/teachers/t001' },
];

const mockBooks = [
  { id: 'b001', type: 'Book', title: 'The Great Gatsby', subtitle: 'F. Scott Fitzgerald - Fiction', link: '/library/books' },
];

export const globalSearch = async (req: Request, res: Response) => {
  const { q } = req.query;
  const query = (q as string || '').toLowerCase();

  if (!query) return sendSuccess(res, []);

  const results = [
    ...mockStudents,
    ...mockTeachers,
    ...mockBooks
  ].filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.subtitle.toLowerCase().includes(query)
  );

  return sendSuccess(res, results);
};

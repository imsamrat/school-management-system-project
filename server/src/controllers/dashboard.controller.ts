import { Response } from 'express';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  // Return demo stats including library and activities
  return sendSuccess(res, {
    totalStudents: 1250,
    activeTeachers: 85,
    totalEmployees: 40,
    todayAttendance: 94.5,
    pendingFees: 75000,
    todayCollection: 12500,
    booksIssued: 45,
    recentActivities: [
      { id: 1, action: 'Fee collected for John Doe', time: '10 mins ago', type: 'finance' },
      { id: 2, action: 'New student admission', time: '1 hour ago', type: 'admission' },
      { id: 3, action: 'Library book issued', time: '2 hours ago', type: 'library' },
      { id: 4, action: 'Exam schedule updated', time: '3 hours ago', type: 'academic' },
    ]
  });
};

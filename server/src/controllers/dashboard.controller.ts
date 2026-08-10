import { Response } from 'express';
import { sendSuccess } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  // Return demo stats
  return sendSuccess(res, {
    totalStudents: 210,
    activeTeachers: 5,
    totalEmployees: 10,
    todayAttendance: 94.5,
    pendingFees: 75000,
    todayCollection: 25000
  });
};

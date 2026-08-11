import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

export const getGeneralReports = async (req: Request, res: Response) => {
  // Aggregate mock data for reports
  const reportData = {
    attendance: [
      { month: 'Jan', present: 92, absent: 8 },
      { month: 'Feb', present: 88, absent: 12 },
      { month: 'Mar', present: 95, absent: 5 },
      { month: 'Apr', present: 90, absent: 10 },
      { month: 'May', present: 93, absent: 7 },
    ],
    finance: [
      { month: 'Jan', collected: 450000, pending: 120000 },
      { month: 'Feb', collected: 520000, pending: 95000 },
      { month: 'Mar', collected: 480000, pending: 130000 },
      { month: 'Apr', collected: 550000, pending: 80000 },
      { month: 'May', collected: 510000, pending: 110000 },
    ]
  };
  return sendSuccess(res, reportData);
};

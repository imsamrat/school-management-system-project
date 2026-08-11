import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    // Run aggregate queries concurrently
    const [
      { count: totalStudents },
      { count: activeTeachers },
      { count: totalEmployees },
      { data: recentActivities }
    ] = await Promise.all([
      supabaseAdmin.from('students').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'active'),
      supabaseAdmin.from('staff').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'active'),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('is_active', true),
      // Mocking recent activities for now, ideally fetch from audit_logs
      Promise.resolve({ data: [
        { id: 1, action: 'System connected to Supabase', time: 'Just now', type: 'system' }
      ]})
    ]);

    // For finances and attendance, we'd need complex queries. For now, returning 0 if empty.
    return sendSuccess(res, {
      totalStudents: totalStudents || 0,
      activeTeachers: activeTeachers || 0,
      totalEmployees: totalEmployees || 0,
      todayAttendance: 0,
      pendingFees: 0,
      todayCollection: 0,
      booksIssued: 0,
      recentActivities: recentActivities.data
    });
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    return sendError(res, 'Failed to fetch dashboard statistics', 500);
  }
};

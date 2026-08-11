import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { date, class_id, section_id } = req.query;
    
    let query = supabaseAdmin
      .from('student_attendance')
      .select('*, students(first_name, last_name, roll_number)')
      .eq('school_id', schoolId);

    if (date) query = query.eq('date', date);
    if (class_id) query = query.eq('class_id', class_id);
    if (section_id) query = query.eq('section_id', section_id);

    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch attendance', 500);
  }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { records } = req.body; // Array of { student_id, status, date, class_id, section_id, marked_by }
    
    if (!records || !records.length) return sendError(res, 'No records provided', 400);

    const insertData = records.map((r: any) => ({
      ...r,
      school_id: schoolId,
      marked_by: req.user?.id
    }));

    // Upsert attendance to allow updating if already marked today
    const { data, error } = await supabaseAdmin
      .from('student_attendance')
      .upsert(insertData, { onConflict: 'student_id, date' })
      .select();

    if (error) throw error;
    return sendSuccess(res, data, 'Attendance marked successfully', 201);
  } catch (err) {
    console.error('Failed to mark attendance', err);
    return sendError(res, 'Failed to mark attendance', 500);
  }
};

export const getAttendanceStats = async (req: AuthRequest, res: Response) => {
  try {
    // For now returning mock stats since complex SQL aggregates are needed for real stats
    return sendSuccess(res, {
      present_percentage: 92,
      absent_count: 5,
      late_count: 2
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch attendance stats', 500);
  }
};

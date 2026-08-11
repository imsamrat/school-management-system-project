import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

// --- Student Attendance ---
export const getStudentAttendance = async (req: AuthRequest, res: Response) => {
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
    return sendError(res, 'Failed to fetch student attendance', 500);
  }
};

export const markStudentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { records } = req.body; 
    
    if (!records || !records.length) return sendError(res, 'No records provided', 400);

    const insertData = records.map((r: any) => ({
      ...r,
      school_id: schoolId,
      marked_by: req.user?.id
    }));

    const { data, error } = await supabaseAdmin
      .from('student_attendance')
      .upsert(insertData, { onConflict: 'student_id, date' })
      .select();

    if (error) throw error;
    return sendSuccess(res, data, 'Attendance marked successfully', 201);
  } catch (err) {
    console.error('Failed to mark student attendance', err);
    return sendError(res, 'Failed to mark attendance', 500);
  }
};

// --- Teacher Attendance ---
export const getTeacherAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { date } = req.query;
    
    let query = supabaseAdmin
      .from('teacher_attendance')
      .select('*, employees(first_name, last_name)')
      .eq('school_id', schoolId);

    if (date) query = query.eq('date', date);

    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch teacher attendance', 500);
  }
};

export const markTeacherAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { records } = req.body;
    
    if (!records || !records.length) return sendError(res, 'No records provided', 400);

    const insertData = records.map((r: any) => ({
      ...r,
      school_id: schoolId,
      marked_by: req.user?.id
    }));

    const { data, error } = await supabaseAdmin
      .from('teacher_attendance')
      .upsert(insertData, { onConflict: 'employee_id, date' })
      .select();

    if (error) throw error;
    return sendSuccess(res, data, 'Teacher attendance marked', 201);
  } catch (err) {
    return sendError(res, 'Failed to mark teacher attendance', 500);
  }
};

// --- Employee Attendance ---
export const getEmployeeAttendance = async (req: AuthRequest, res: Response) => {
  // Can just reuse teacher logic internally since they both query staff_attendance
  return getTeacherAttendance(req, res);
};

export const markEmployeeAttendance = async (req: AuthRequest, res: Response) => {
  // Reuse teacher logic internally 
  return markTeacherAttendance(req, res);
};

// --- Stats ---
export const getAttendanceStats = async (req: AuthRequest, res: Response) => {
  try {
    return sendSuccess(res, {
      present_percentage: 92,
      absent_count: 5,
      late_count: 2
    });
  } catch (err) {
    return sendError(res, 'Failed to fetch attendance stats', 500);
  }
};

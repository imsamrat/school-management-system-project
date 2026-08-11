import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { q } = req.query;
    let query = supabaseAdmin
      .from('students')
      .select('*, classes(name), sections(name)')
      .eq('school_id', schoolId)
      .neq('status', 'withdrawn');

    if (q && typeof q === 'string') {
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,admission_number.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching students:', err);
    return sendError(res, 'Failed to fetch students', 500);
  }
};

export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('students')
      .select('*, classes(name), sections(name)')
      .eq('school_id', schoolId)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return sendError(res, 'Student not found', 404);

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching student:', err);
    return sendError(res, 'Failed to fetch student details', 500);
  }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const newStudent = {
      ...req.body,
      school_id: schoolId,
      status: 'active'
    };

    const { data, error } = await supabaseAdmin
      .from('students')
      .insert(newStudent)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Student created successfully', 201);
  } catch (err: any) {
    console.error('Error creating student:', err);
    return sendError(res, 'Failed to create student', 500);
  }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('students')
      .update(req.body)
      .eq('school_id', schoolId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Student updated successfully');
  } catch (err: any) {
    console.error('Error updating student:', err);
    return sendError(res, 'Failed to update student', 500);
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    // Soft delete logic
    const { error } = await supabaseAdmin
      .from('students')
      .update({ status: 'withdrawn' })
      .eq('school_id', schoolId)
      .eq('id', id);

    if (error) throw error;
    return sendSuccess(res, null, 'Student deleted successfully');
  } catch (err: any) {
    console.error('Error deleting student:', err);
    return sendError(res, 'Failed to delete student', 500);
  }
};

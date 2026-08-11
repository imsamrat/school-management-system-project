import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getTeachers = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { q } = req.query;
    let query = supabaseAdmin
      .from('staff')
      .select('*')
      .eq('school_id', schoolId)
      .eq('role', 'teacher')
      .neq('status', 'terminated');

    if (q && typeof q === 'string') {
      query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,staff_id_code.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching teachers:', err);
    return sendError(res, 'Failed to fetch teachers', 500);
  }
};

export const getTeacherById = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('staff')
      .select('*')
      .eq('school_id', schoolId)
      .eq('id', id)
      .eq('role', 'teacher')
      .single();

    if (error) throw error;
    if (!data) return sendError(res, 'Teacher not found', 404);

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching teacher:', err);
    return sendError(res, 'Failed to fetch teacher details', 500);
  }
};

export const createTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const newTeacher = {
      ...req.body,
      school_id: schoolId,
      role: 'teacher',
      status: 'active'
    };

    const { data, error } = await supabaseAdmin
      .from('staff')
      .insert(newTeacher)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Teacher created successfully', 201);
  } catch (err: any) {
    console.error('Error creating teacher:', err);
    return sendError(res, 'Failed to create teacher', 500);
  }
};

export const updateTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('staff')
      .update(req.body)
      .eq('school_id', schoolId)
      .eq('id', id)
      .eq('role', 'teacher')
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Teacher updated successfully');
  } catch (err: any) {
    console.error('Error updating teacher:', err);
    return sendError(res, 'Failed to update teacher', 500);
  }
};

export const deleteTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('staff')
      .update({ status: 'terminated' })
      .eq('school_id', schoolId)
      .eq('id', id)
      .eq('role', 'teacher');

    if (error) throw error;
    return sendSuccess(res, null, 'Teacher deleted successfully');
  } catch (err: any) {
    console.error('Error deleting teacher:', err);
    return sendError(res, 'Failed to delete teacher', 500);
  }
};

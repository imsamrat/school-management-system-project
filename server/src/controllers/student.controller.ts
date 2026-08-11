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

export const getStudentGuardians = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('student_guardians')
      .select('*')
      .eq('student_id', id)
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    console.error('Error fetching guardians:', err);
    return sendError(res, 'Failed to fetch guardians', 500);
  }
};

export const addStudentGuardian = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // If this is set as primary, unset others first
    if (req.body.is_primary) {
      await supabaseAdmin
        .from('student_guardians')
        .update({ is_primary: false })
        .eq('student_id', id);
    }

    const { data, error } = await supabaseAdmin
      .from('student_guardians')
      .insert({
        ...req.body,
        student_id: id
      })
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Guardian added successfully', 201);
  } catch (err) {
    console.error('Error adding guardian:', err);
    return sendError(res, 'Failed to add guardian', 500);
  }
};

export const deleteStudentGuardian = async (req: AuthRequest, res: Response) => {
  try {
    const { guardianId } = req.params;
    const { error } = await supabaseAdmin
      .from('student_guardians')
      .delete()
      .eq('id', guardianId);

    if (error) throw error;
    return sendSuccess(res, null, 'Guardian deleted successfully');
  } catch (err) {
    console.error('Error deleting guardian:', err);
    return sendError(res, 'Failed to delete guardian', 500);
  }
};

import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getAcademicYears = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('academic_years').select('*').eq('school_id', schoolId).order('start_date', { ascending: false });
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch academic years', 500);
  }
};

// Classes
export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('classes').select('*').eq('school_id', schoolId).order('numeric_order', { ascending: true });
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch classes', 500);
  }
};

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('classes').insert({ ...req.body, school_id: schoolId }).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Class created', 201);
  } catch (err) {
    return sendError(res, 'Failed to create class', 500);
  }
};

export const updateClass = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('classes').update(req.body).eq('school_id', schoolId).eq('id', req.params.id).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Class updated');
  } catch (err) {
    return sendError(res, 'Failed to update class', 500);
  }
};

// Sections
export const getSections = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
      .from('sections')
      .select('*, classes!inner(name, school_id)')
      .eq('classes.school_id', schoolId)
      .order('name', { ascending: true });
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch sections', 500);
  }
};

export const createSection = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from('sections').insert(req.body).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Section created', 201);
  } catch (err) {
    return sendError(res, 'Failed to create section', 500);
  }
};

// Subjects
export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('subjects').select('*').eq('school_id', schoolId).order('name', { ascending: true });
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch subjects', 500);
  }
};

export const createSubject = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('subjects').insert({ ...req.body, school_id: schoolId }).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Subject created', 201);
  } catch (err) {
    return sendError(res, 'Failed to create subject', 500);
  }
};

// Course Assignments (Teachers assigned to subjects for specific sections)
export const getCourseAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
      .from('course_assignments')
      .select('*, teachers(first_name, last_name)')
      .eq('school_id', schoolId);
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendSuccess(res, []); // Return empty if table doesn't exist
  }
};

export const createCourseAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('course_assignments').insert({ ...req.body, school_id: schoolId }).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Assignment created', 201);
  } catch (err) {
    return sendError(res, 'Failed to create assignment', 500);
  }
};

export const getClassRoutines = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
      .from('class_routines')
      .select('*, classes!inner(name, school_id)')
      .eq('classes.school_id', schoolId);
    
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch class routines', 500);
  }
};

export const createClassRoutine = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from('class_routines').insert(req.body).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Class routine created', 201);
  } catch (err) {
    return sendError(res, 'Failed to create class routine', 500);
  }
};

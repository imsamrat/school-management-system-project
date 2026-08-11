import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getExams = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('examinations').select('*').eq('school_id', schoolId).order('start_date', { ascending: false });
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch exams', 500);
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('examinations').insert({ ...req.body, school_id: schoolId }).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Exam created successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to create exam', 500);
  }
};

export const updateExam = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('examinations').update(req.body).eq('school_id', schoolId).eq('id', id).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Exam updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update exam', 500);
  }
};

export const getExamSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
        .from('exam_schedules')
        .select('*, examinations(name), classes(name), subjects(name)')
        .eq('school_id', schoolId);
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch exam schedules', 500);
  }
};

export const createExamSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('exam_schedules').insert({ ...req.body, school_id: schoolId }).select().single();
    if (error) throw error;
    return sendSuccess(res, data, 'Schedule created successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to create schedule', 500);
  }
};

export const getMarks = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { exam_id, class_id } = req.query;
    let query = supabaseAdmin.from('exam_marks').select('*, students(first_name, last_name, roll_number), subjects(name)').eq('school_id', schoolId);
    
    if (exam_id) query = query.eq('exam_id', exam_id);
    
    const { data, error } = await query;
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch marks', 500);
  }
};

export const saveMarks = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { marks } = req.body;
    
    if (!marks || !marks.length) return sendError(res, 'No marks provided', 400);

    const insertData = marks.map((m: any) => ({
      ...m,
      school_id: schoolId
    }));

    const { data, error } = await supabaseAdmin.from('exam_marks').upsert(insertData, { onConflict: 'exam_id, student_id, subject_id' }).select();
    if (error) throw error;

    return sendSuccess(res, data, 'Marks submitted successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to submit marks', 500);
  }
};

export const getStudentMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // We want to fetch student marks and join with exam_subjects and exams
    const { data, error } = await supabaseAdmin
      .from('student_marks')
      .select(`
        *,
        exam_subjects (
          *,
          exams (name, exam_type, start_date),
          subjects (name, code)
        )
      `)
      .eq('student_id', id);

    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    console.error('Error fetching student marks:', err);
    return sendError(res, 'Failed to fetch student marks', 500);
  }
};

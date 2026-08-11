import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { status } = req.query;
    
    let query = supabaseAdmin
        .from('admission_applications')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch applications', 500);
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
        .from('admission_applications')
        .insert({ ...req.body, school_id: schoolId, status: 'pending' })
        .select()
        .single();
        
    if (error) throw error;
    return sendSuccess(res, data, 'Application submitted successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to submit application', 500);
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    
    const { data, error } = await supabaseAdmin
        .from('admission_applications')
        .update({ status, comments })
        .eq('id', id)
        .select()
        .single();
        
    if (error) throw error;
    
    // If approved, ideally trigger student creation here via Supabase function or webhook
    
    return sendSuccess(res, data, 'Application status updated');
  } catch (err) {
    return sendError(res, 'Failed to update application', 500);
  }
};

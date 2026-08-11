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
    
    // Automatically create student if approved
    if (status === 'approved') {
      try {
        // Get active academic year
        const { data: academicYear } = await supabaseAdmin
          .from('academic_years')
          .select('id')
          .eq('school_id', data.school_id)
          .eq('status', 'active')
          .single();

        const admissionNumber = `ADM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        
        const { error: studentError } = await supabaseAdmin
          .from('students')
          .insert({
            school_id: data.school_id,
            first_name: data.first_name,
            last_name: data.last_name,
            date_of_birth: data.date_of_birth,
            gender: data.gender?.toLowerCase(),
            previous_school: data.previous_school,
            admission_number: admissionNumber,
            academic_year_id: academicYear?.id,
            status: 'active'
          });

        if (studentError) {
          console.error('Failed to create student from application:', studentError);
        }
      } catch (err) {
        console.error('Error during automatic student creation:', err);
      }
    }
    
    return sendSuccess(res, data, 'Application status updated');
  } catch (err) {
    return sendError(res, 'Failed to update application', 500);
  }
};

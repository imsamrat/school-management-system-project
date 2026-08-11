import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getSchoolProfile = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { data, error } = await supabaseAdmin
      .from('schools')
      .select('name, logo_url, address, city, state, country, postal_code, phone, email, website, principal_name, established_year, registration_number')
      .eq('id', schoolId)
      .single();

    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching school profile:', err);
    return sendError(res, 'Failed to fetch school profile', 500);
  }
};

export const updateSchoolProfile = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { data, error } = await supabaseAdmin
      .from('schools')
      .update(req.body)
      .eq('id', schoolId)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'School profile updated successfully');
  } catch (err: any) {
    console.error('Error updating school profile:', err);
    return sendError(res, 'Failed to update school profile', 500);
  }
};

export const getSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { data, error } = await supabaseAdmin
      .from('schools')
      .select('settings')
      .eq('id', schoolId)
      .single();

    if (error) throw error;
    return sendSuccess(res, data?.settings || {});
  } catch (err: any) {
    console.error('Error fetching system settings:', err);
    return sendError(res, 'Failed to fetch system settings', 500);
  }
};

export const updateSystemSettings = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    // Fetch existing settings first
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('schools')
      .select('settings')
      .eq('id', schoolId)
      .single();

    if (fetchError) throw fetchError;

    const updatedSettings = { ...(existing?.settings || {}), ...req.body };

    const { data, error } = await supabaseAdmin
      .from('schools')
      .update({ settings: updatedSettings })
      .eq('id', schoolId)
      .select('settings')
      .single();

    if (error) throw error;
    return sendSuccess(res, data?.settings, 'System settings updated successfully');
  } catch (err: any) {
    console.error('Error updating system settings:', err);
    return sendError(res, 'Failed to update system settings', 500);
  }
};

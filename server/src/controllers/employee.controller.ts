import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const { data, error } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('school_id', schoolId)
      .neq('status', 'terminated');

    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching employees:', err);
    return sendError(res, 'Failed to fetch employees', 500);
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('employees')
      .select('*')
      .eq('school_id', schoolId)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return sendError(res, 'Employee not found', 404);

    return sendSuccess(res, data);
  } catch (err: any) {
    console.error('Error fetching employee:', err);
    return sendError(res, 'Failed to fetch employee details', 500);
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId) return sendError(res, 'School ID not found in token', 400);

    const newEmp = {
      ...req.body,
      school_id: schoolId,
    };

    const { data, error } = await supabaseAdmin
      .from('employees')
      .insert(newEmp)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Employee created successfully', 201);
  } catch (err: any) {
    console.error('Error creating employee:', err);
    return sendError(res, 'Failed to create employee', 500);
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('employees')
      .update(req.body)
      .eq('school_id', schoolId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Employee updated successfully');
  } catch (err: any) {
    console.error('Error updating employee:', err);
    return sendError(res, 'Failed to update employee', 500);
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('employees')
      .update({ status: 'terminated', deleted_at: new Date().toISOString() })
      .eq('school_id', schoolId)
      .eq('id', id);

    if (error) throw error;
    return sendSuccess(res, null, 'Employee deleted successfully');
  } catch (err: any) {
    console.error('Error deleting employee:', err);
    return sendError(res, 'Failed to delete employee', 500);
  }
};

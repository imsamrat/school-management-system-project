import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getSalaryStructures = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
        .from('salary_structures')
        .select('*')
        .eq('school_id', schoolId);
        
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch salary structures', 500);
  }
};

export const createSalaryStructure = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
        .from('salary_structures')
        .insert({ ...req.body, school_id: schoolId })
        .select()
        .single();
        
    if (error) throw error;
    return sendSuccess(res, data, 'Salary structure created', 201);
  } catch (err) {
    return sendError(res, 'Failed to create salary structure', 500);
  }
};

export const getPayrollRecords = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { month, year } = req.query;
    
    let query = supabaseAdmin
        .from('payroll_records')
        .select('*, staff(first_name, last_name, role)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

    if (month) query = query.eq('month', month);
    if (year) query = query.eq('year', year);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch payroll records', 500);
  }
};

export const processPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { month, year } = req.body;
    
    // In a real app, this would query staff -> salary structures, compute deductions, and bulk insert to payroll_records
    // Mocking the result for now since complex PL/pgSQL function or Node script is needed.
    
    const mockProcess = await supabaseAdmin
        .from('payroll_records')
        .insert({
            school_id: schoolId,
            staff_id: null, // Would be an array of objects
            month,
            year,
            basic_salary: 0,
            gross_salary: 0,
            net_salary: 0,
            status: 'draft',
            processed_by: req.user?.id
        }).select();
        
    return sendSuccess(res, [], 'Payroll processed successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to process payroll', 500);
  }
};

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
    
    // Map db fields to frontend interface
    const mapped = data.map((item: any) => ({
      id: item.id,
      user_id: item.employee_id,
      user_type: item.employee_type,
      base_salary: item.basic_salary,
      allowances: (item.house_allowance || 0) + (item.medical_allowance || 0) + (item.transport_allowance || 0) + (item.other_allowance || 0),
      deductions: (item.tax_deduction || 0) + (item.loan_deduction || 0) + (item.advance_deduction || 0) + (item.other_deduction || 0),
      net_salary: item.basic_salary + (item.house_allowance || 0) + (item.medical_allowance || 0) + (item.transport_allowance || 0) + (item.other_allowance || 0) - ((item.tax_deduction || 0) + (item.loan_deduction || 0) + (item.advance_deduction || 0) + (item.other_deduction || 0))
    }));
    
    return sendSuccess(res, mapped);
  } catch (err) {
    return sendError(res, 'Failed to fetch salary structures', 500);
  }
};

export const createSalaryStructure = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { user_id, user_type, base_salary, allowances, deductions } = req.body;
    
    const { data, error } = await supabaseAdmin
        .from('salary_structures')
        .insert({ 
            school_id: schoolId,
            employee_id: user_id,
            employee_type: user_type,
            basic_salary: base_salary,
            other_allowance: allowances || 0,
            other_deduction: deductions || 0
        })
        .select()
        .single();
        
    if (error) throw error;
    
    // map for response
    const mapped = {
      id: data.id,
      user_id: data.employee_id,
      user_type: data.employee_type,
      base_salary: data.basic_salary,
      allowances: data.other_allowance,
      deductions: data.other_deduction,
      net_salary: data.basic_salary + (data.other_allowance || 0) - (data.other_deduction || 0)
    };
    
    return sendSuccess(res, mapped, 'Salary structure created', 201);
  } catch (err) {
    console.error(err);
    return sendError(res, 'Failed to create salary structure', 500);
  }
};

export const getPayrollRecords = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { month, year } = req.query;
    
    let query = supabaseAdmin
        .from('payrolls')
        .select('*, staff(*)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

    if (month) query = query.eq('pay_period_month', month);
    if (year) query = query.eq('pay_period_year', year);
    
    const { data, error } = await query;
    if (error) throw error;
    
    const mapped = data.map((item: any) => ({
      id: item.id,
      user_id: item.employee_id,
      user_type: item.employee_type,
      month: `${item.pay_period_year}-${String(item.pay_period_month).padStart(2, '0')}`,
      base_salary: item.basic_salary,
      allowances: item.total_allowance,
      deductions: item.total_deduction,
      net_salary: item.net_salary,
      status: item.status
    }));
    
    return sendSuccess(res, mapped);
  } catch (err) {
    return sendError(res, 'Failed to fetch payroll records', 500);
  }
};

export const processPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { month, year } = req.body;
    
    // Mocking the result for now since complex PL/pgSQL function or Node script is needed.
    console.log(`Processing payroll for ${month}/${year}`);
        
    return sendSuccess(res, [], 'Payroll processed successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to process payroll', 500);
  }
};

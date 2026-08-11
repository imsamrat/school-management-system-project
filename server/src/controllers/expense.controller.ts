import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getExpenseCategories = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
      .from('expense_categories')
      .select('*')
      .eq('school_id', schoolId)
      .order('name');
      
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    console.error('Error fetching expense categories:', err);
    return sendError(res, 'Failed to fetch categories', 500);
  }
};

export const createExpenseCategory = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { name, description } = req.body;

    const { data, error } = await supabaseAdmin
      .from('expense_categories')
      .insert({
        school_id: schoolId,
        name,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Category created successfully', 201);
  } catch (err: any) {
    console.error('Error creating expense category:', err);
    if (err.code === '23505') { // unique violation
      return sendError(res, 'Category already exists', 400);
    }
    return sendError(res, 'Failed to create category', 500);
  }
};

export const deleteExpenseCategory = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('expense_categories')
      .delete()
      .eq('school_id', schoolId)
      .eq('id', id);

    if (error) throw error;
    return sendSuccess(res, null, 'Category deleted successfully');
  } catch (err: any) {
    console.error('Error deleting expense category:', err);
    if (err.code === '23503') { // foreign key violation
      return sendError(res, 'Cannot delete category that is in use by expenses', 400);
    }
    return sendError(res, 'Failed to delete category', 500);
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { start_date, end_date, category_id } = req.query;
    
    let query = supabaseAdmin
      .from('expenses')
      .select('*, expense_categories(name)')
      .eq('school_id', schoolId)
      .order('expense_date', { ascending: false });

    if (start_date) query = query.gte('expense_date', start_date);
    if (end_date) query = query.lte('expense_date', end_date);
    if (category_id) query = query.eq('category_id', category_id);

    const { data, error } = await query;
    if (error) throw error;
    
    // Flatten category name for easier frontend consumption
    const formattedData = data.map(expense => ({
      ...expense,
      category_name: expense.expense_categories?.name || 'Unknown'
    }));

    return sendSuccess(res, formattedData);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    return sendError(res, 'Failed to fetch expenses', 500);
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { category_id, amount, expense_date, title, description, receipt_url } = req.body;

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert({
        school_id: schoolId,
        category_id,
        amount,
        expense_date: expense_date || new Date().toISOString().split('T')[0],
        title,
        description,
        receipt_url,
        recorded_by: req.user?.id
      })
      .select('*, expense_categories(name)')
      .single();

    if (error) throw error;
    return sendSuccess(res, {
      ...data,
      category_name: data.expense_categories?.name || 'Unknown'
    }, 'Expense recorded successfully', 201);
  } catch (err) {
    console.error('Error creating expense:', err);
    return sendError(res, 'Failed to create expense', 500);
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('expenses')
      .delete()
      .eq('school_id', schoolId)
      .eq('id', id);

    if (error) throw error;
    return sendSuccess(res, null, 'Expense deleted successfully');
  } catch (err) {
    console.error('Error deleting expense:', err);
    return sendError(res, 'Failed to delete expense', 500);
  }
};

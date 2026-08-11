import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getFeeStructures = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('fee_structures').select('*').eq('school_id', schoolId);
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendSuccess(res, []);
  }
};

export const createFeeStructure = async (req: AuthRequest, res: Response) => {
  return sendError(res, 'Not implemented for Supabase yet', 501);
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
  return sendError(res, 'Not implemented for Supabase yet', 501);
};

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin.from('fee_payments').select('*').eq('school_id', schoolId).order('created_at', { ascending: false });
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendSuccess(res, []);
  }
};

export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { status, student_id } = req.query;
    
    let query = supabaseAdmin
        .from('fee_invoices')
        .select('*, students(first_name, last_name, admission_number), fee_types(name)')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (student_id) query = query.eq('student_id', student_id);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch invoices', 500);
  }
};

export const collectPayment = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { invoice_id, amount, payment_method, remarks } = req.body;
    
    // 1. Get the invoice to verify amount
    const { data: invoice, error: invoiceError } = await supabaseAdmin
        .from('fee_invoices')
        .select('*')
        .eq('school_id', schoolId)
        .eq('id', invoice_id)
        .single();
        
    if (invoiceError || !invoice) return sendError(res, 'Invoice not found', 404);
    
    // 2. Insert payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
        .from('fee_payments')
        .insert({
            school_id: schoolId,
            invoice_id,
            student_id: invoice.student_id,
            amount,
            payment_method,
            remarks,
            collected_by: req.user?.id
        })
        .select()
        .single();
        
    if (paymentError) throw paymentError;
    
    // 3. Update invoice status and paid amount
    const newPaidAmount = Number(invoice.paid_amount) + Number(amount);
    const newStatus = newPaidAmount >= Number(invoice.total_amount) ? 'paid' : 'partial';
    
    await supabaseAdmin
        .from('fee_invoices')
        .update({
            paid_amount: newPaidAmount,
            status: newStatus
        })
        .eq('id', invoice_id);

    return sendSuccess(res, payment, 'Payment collected successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to collect payment', 500);
  }
};

export const getFeeTypes = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { data, error } = await supabaseAdmin
        .from('fee_types')
        .select('*')
        .eq('school_id', schoolId);
        
    if (error) throw error;
    return sendSuccess(res, data);
  } catch (err) {
    return sendError(res, 'Failed to fetch fee types', 500);
  }
};

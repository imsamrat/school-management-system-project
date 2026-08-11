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
  try {
    const schoolId = req.user?.schoolId;
    const { class_id, fee_type_id, amount, frequency, due_day, description } = req.body;

    // Get active academic year
    const { data: activeYear, error: yearError } = await supabaseAdmin
      .from('academic_years')
      .select('id')
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .single();

    if (yearError || !activeYear) {
      return sendError(res, 'No active academic year found', 400);
    }

    // Insert fee structure
    const { data, error } = await supabaseAdmin
      .from('fee_structures')
      .insert({
        school_id: schoolId,
        academic_year_id: activeYear.id,
        class_id,
        fee_type_id,
        amount,
        frequency: frequency || 'monthly',
        due_day: due_day || 10,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Fee structure created successfully', 201);
  } catch (err) {
    console.error('Error creating fee structure:', err);
    return sendError(res, 'Failed to create fee structure', 500);
  }
};

export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user?.schoolId;
    const { student_id, fee_structure_id, amount, discount = 0, due_date } = req.body;

    // Get active academic year
    const { data: activeYear, error: yearError } = await supabaseAdmin
      .from('academic_years')
      .select('id')
      .eq('school_id', schoolId)
      .eq('status', 'active')
      .single();

    if (yearError || !activeYear) {
      return sendError(res, 'No active academic year found', 400);
    }

    const net_amount = Number(amount) - Number(discount);
    // Generate invoice number e.g. INV-2026-XXXX
    const invoice_number = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const { data, error } = await supabaseAdmin
      .from('fee_invoices')
      .insert({
        school_id: schoolId,
        invoice_number,
        student_id,
        academic_year_id: activeYear.id,
        fee_structure_id,
        amount,
        discount,
        net_amount,
        due_date
      })
      .select()
      .single();

    if (error) throw error;
    return sendSuccess(res, data, 'Invoice created successfully', 201);
  } catch (err) {
    console.error('Error creating invoice:', err);
    return sendError(res, 'Failed to create invoice', 500);
  }
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

export const getStudentFees = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch invoices
    const { data: invoices, error: invError } = await supabaseAdmin
      .from('fee_invoices')
      .select('*, fee_structures(*)')
      .eq('student_id', id)
      .order('created_at', { ascending: false });
      
    if (invError) throw invError;
    
    // Fetch payments
    const { data: payments, error: payError } = await supabaseAdmin
      .from('fee_payments')
      .select('*')
      .eq('student_id', id)
      .order('paid_date', { ascending: false });
      
    if (payError) throw payError;
    
    return sendSuccess(res, { invoices, payments });
  } catch (err) {
    console.error('Error fetching student fees:', err);
    return sendError(res, 'Failed to fetch student fees', 500);
  }
};

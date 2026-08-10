import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let feeStructures = [
  { id: 'fs1', class_id: 'c1', name: 'Tuition Fee', amount: 500, frequency: 'monthly' },
  { id: 'fs2', class_id: 'c1', name: 'Transport Fee', amount: 150, frequency: 'monthly' },
];

let invoices = [
  { id: 'inv1', student_id: 's001', title: 'October 2026 Tuition', amount: 500, status: 'unpaid', due_date: '2026-10-10', created_at: '2026-10-01' },
  { id: 'inv2', student_id: 's001', title: 'September 2026 Tuition', amount: 500, status: 'paid', due_date: '2026-09-10', created_at: '2026-09-01' },
];

let payments = [
  { id: 'pay1', invoice_id: 'inv2', student_id: 's001', amount: 500, payment_method: 'bank_transfer', reference_number: 'TXN12345', payment_date: '2026-09-09' },
];

// Fee Structures
export const getFeeStructures = async (req: Request, res: Response) => {
  const { class_id } = req.query;
  const filtered = class_id ? feeStructures.filter(f => f.class_id === class_id) : feeStructures;
  return sendSuccess(res, filtered);
};

export const createFeeStructure = async (req: Request, res: Response) => {
  const newFS = { id: `fs${feeStructures.length + 1}`, ...req.body };
  feeStructures.push(newFS);
  return sendSuccess(res, newFS, 'Fee Structure created', 201);
};

// Invoices
export const getInvoices = async (req: Request, res: Response) => {
  const { student_id, status } = req.query;
  let filtered = invoices;
  if (student_id) filtered = filtered.filter(i => i.student_id === student_id);
  if (status) filtered = filtered.filter(i => i.status === status);
  return sendSuccess(res, filtered);
};

export const createInvoice = async (req: Request, res: Response) => {
  const newInvoice = { 
    id: `inv${invoices.length + 1}`, 
    status: 'unpaid', 
    created_at: new Date().toISOString().split('T')[0], 
    ...req.body 
  };
  invoices.push(newInvoice);
  return sendSuccess(res, newInvoice, 'Invoice created', 201);
};

// Payments
export const getPayments = async (req: Request, res: Response) => {
  const { student_id } = req.query;
  let filtered = payments;
  if (student_id) filtered = filtered.filter(p => p.student_id === student_id);
  return sendSuccess(res, filtered);
};

export const collectPayment = async (req: Request, res: Response) => {
  const { invoice_id, amount, payment_method, reference_number } = req.body;
  
  const invoiceIndex = invoices.findIndex(i => i.id === invoice_id);
  if (invoiceIndex === -1) return sendError(res, 'Invoice not found', 404);
  
  const invoice = invoices[invoiceIndex];
  
  const newPayment = {
    id: `pay${payments.length + 1}`,
    invoice_id,
    student_id: invoice.student_id,
    amount,
    payment_method,
    reference_number: reference_number || '',
    payment_date: new Date().toISOString().split('T')[0]
  };
  
  payments.push(newPayment);
  
  // Update invoice status
  const totalPaid = payments.filter(p => p.invoice_id === invoice_id).reduce((sum, p) => sum + p.amount, 0);
  if (totalPaid >= invoice.amount) {
    invoices[invoiceIndex].status = 'paid';
  } else if (totalPaid > 0) {
    invoices[invoiceIndex].status = 'partial';
  }
  
  return sendSuccess(res, newPayment, 'Payment collected successfully', 201);
};

import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let salaryStructures = [
  { id: 'ss1', user_id: 't001', user_type: 'teacher', base_salary: 3000, allowances: 500, deductions: 100, net_salary: 3400 },
];

let payrollRecords = [
  { id: 'pr1', user_id: 't001', user_type: 'teacher', month: '2026-08', base_salary: 3000, allowances: 500, deductions: 100, net_salary: 3400, status: 'processed', payment_date: '2026-08-31' },
];

// Salary Structures
export const getSalaryStructures = async (req: Request, res: Response) => {
  return sendSuccess(res, salaryStructures);
};

export const createSalaryStructure = async (req: Request, res: Response) => {
  const { user_id, user_type, base_salary, allowances, deductions } = req.body;
  const net_salary = Number(base_salary) + Number(allowances || 0) - Number(deductions || 0);

  const existingIndex = salaryStructures.findIndex(s => s.user_id === user_id);
  if (existingIndex > -1) {
    salaryStructures[existingIndex] = { ...salaryStructures[existingIndex], ...req.body, net_salary };
    return sendSuccess(res, salaryStructures[existingIndex], 'Salary Structure updated', 200);
  }

  const newStructure = { id: `ss${salaryStructures.length + 1}`, user_id, user_type, base_salary, allowances: allowances || 0, deductions: deductions || 0, net_salary };
  salaryStructures.push(newStructure);
  return sendSuccess(res, newStructure, 'Salary Structure created', 201);
};

// Payroll Processing
export const getPayrollRecords = async (req: Request, res: Response) => {
  const { month } = req.query;
  const filtered = month ? payrollRecords.filter(p => p.month === month) : payrollRecords;
  return sendSuccess(res, filtered);
};

export const processPayroll = async (req: Request, res: Response) => {
  const { month } = req.body; // e.g. '2026-09'
  
  if (!month) return sendError(res, 'Month is required', 400);

  // In a real app, we'd check who doesn't have payroll for this month and generate it based on salary structures
  let processedCount = 0;

  salaryStructures.forEach(struct => {
    const exists = payrollRecords.find(p => p.user_id === struct.user_id && p.month === month);
    if (!exists) {
      payrollRecords.push({
        id: `pr${payrollRecords.length + 1}`,
        user_id: struct.user_id,
        user_type: struct.user_type,
        month,
        base_salary: struct.base_salary,
        allowances: struct.allowances,
        deductions: struct.deductions,
        net_salary: struct.net_salary,
        status: 'processed',
        payment_date: new Date().toISOString().split('T')[0]
      });
      processedCount++;
    }
  });

  return sendSuccess(res, null, `Payroll processed for ${processedCount} employees`, 201);
};

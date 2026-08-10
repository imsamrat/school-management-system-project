import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let employees = [
  {
    id: 'e001',
    employee_id_code: 'EMP-001',
    first_name: 'Michael',
    last_name: 'Davis',
    department: 'Administration',
    designation: 'Accountant',
    status: 'active',
  }
];

export const getEmployees = async (req: Request, res: Response) => {
  return sendSuccess(res, employees);
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const emp = employees.find((e) => e.id === req.params.id);
  if (!emp) return sendError(res, 'Employee not found', 404);
  return sendSuccess(res, emp);
};

export const createEmployee = async (req: Request, res: Response) => {
  const newEmp = { id: `e00${employees.length + 1}`, ...req.body, status: 'active' };
  employees.push(newEmp);
  return sendSuccess(res, newEmp, 'Employee created', 201);
};

export const updateEmployee = async (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) return sendError(res, 'Employee not found', 404);
  employees[index] = { ...employees[index], ...req.body };
  return sendSuccess(res, employees[index], 'Employee updated');
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) return sendError(res, 'Employee not found', 404);
  employees[index].status = 'terminated';
  return sendSuccess(res, null, 'Employee deleted');
};

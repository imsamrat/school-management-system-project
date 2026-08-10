import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../types/express.js';

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Demo validation (Replace with actual Supabase logic later)
  if (email === 'admin@greenvalley.edu' && password === 'admin123') {
    const user = {
      id: 'u0000000-0000-0000-0000-000000000001',
      schoolId: '550e8400-e29b-41d4-a716-446655440000',
      email: 'admin@greenvalley.edu',
      fullName: 'System Administrator',
      roles: [{ id: 'a1', name: 'Super Admin' }],
      permissions: [
        'dashboard.view', 'students.view', 'students.create', 'students.edit', 'students.delete',
        'teachers.view', 'teachers.create', 'teachers.edit',
        'employees.view', 'employees.create', 'employees.edit',
        'attendance.view', 'attendance.mark', 'attendance.edit',
        'exams.view', 'exams.create', 'exams.manage',
        'marks.view', 'marks.enter', 'marks.edit', 'marks.publish',
        'fees.view', 'fees.collect', 'fees.refund', 'fees.report',
        'payroll.view', 'payroll.process', 'payroll.approve',
        'reports.view', 'reports.export',
        'documents.manage', 'settings.manage', 'users.manage', 'audit.view',
        'admissions.view', 'admissions.manage', 'notifications.view',
      ], 
    };

    const token = jwt.sign(user, config.jwtSecret, { expiresIn: '1d' });

    return sendSuccess(res, {
      user,
      token,
    });
  }

  return sendError(res, 'Invalid email or password', 401);
};

export const getMe = async (req: AuthRequest, res: Response) => {
  return sendSuccess(res, req.user);
};

export const logout = async (req: Request, res: Response) => {
  // In a real app with cookies, we would clear the cookie here
  return sendSuccess(res, null, 'Logged out successfully');
};

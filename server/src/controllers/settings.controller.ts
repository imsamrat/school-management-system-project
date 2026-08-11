import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let schoolProfile = {
  name: 'Green Valley International School',
  email: 'info@greenvalley.edu',
  phone: '+1 (555) 123-4567',
  address: '123 Education Lane, Learning City, ST 12345',
  website: 'https://greenvalley.edu',
  established_year: 1995,
  logo_url: 'https://ui-avatars.com/api/?name=GV&background=0D8B41&color=fff&size=200'
};

let systemSettings = {
  academic_year: '2026-2027',
  currency: 'USD',
  timezone: 'America/New_York',
  enable_sms_notifications: true,
  enable_email_notifications: true
};

export const getSchoolProfile = async (req: Request, res: Response) => {
  return sendSuccess(res, schoolProfile);
};

export const updateSchoolProfile = async (req: Request, res: Response) => {
  schoolProfile = { ...schoolProfile, ...req.body };
  return sendSuccess(res, schoolProfile, 'School profile updated successfully');
};

export const getSystemSettings = async (req: Request, res: Response) => {
  return sendSuccess(res, systemSettings);
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  systemSettings = { ...systemSettings, ...req.body };
  return sendSuccess(res, systemSettings, 'System settings updated successfully');
};

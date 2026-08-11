import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

let applications = [
  { id: 'app1', first_name: 'Jane', last_name: 'Doe', date_of_birth: '2015-05-14', gender: 'Female', phone: '1234567890', email: 'jane@example.com', previous_school: 'City Elementary', applied_class: 'Class 5', status: 'pending', applied_date: '2026-08-01' },
  { id: 'app2', first_name: 'Mike', last_name: 'Ross', date_of_birth: '2016-08-20', gender: 'Male', phone: '0987654321', email: 'mike@example.com', previous_school: '', applied_class: 'Class 4', status: 'approved', applied_date: '2026-08-02' }
];

export const getApplications = async (req: Request, res: Response) => {
  return sendSuccess(res, applications);
};

export const createApplication = async (req: Request, res: Response) => {
  const newApp = { 
    ...req.body, 
    id: `app${applications.length + 1}`,
    status: 'pending',
    applied_date: new Date().toISOString().split('T')[0]
  };
  applications.push(newApp);
  return sendSuccess(res, newApp, 'Admission application submitted successfully', 201);
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appIndex = applications.findIndex(a => a.id === id);
  if (appIndex === -1) return sendError(res, 'Application not found', 404);
  
  applications[appIndex].status = status;
  return sendSuccess(res, applications[appIndex], 'Application status updated');
};

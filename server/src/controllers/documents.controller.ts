import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

// Mock DB state for certificates
let certificates = [
  { id: 'cert1', student_id: 's001', type: 'transfer', issue_date: '2026-08-10', status: 'issued' },
];

export const getCertificates = async (req: Request, res: Response) => {
  return sendSuccess(res, certificates);
};

export const generateCertificate = async (req: Request, res: Response) => {
  const { student_id, type } = req.body;
  const newCert = {
    id: `cert${certificates.length + 1}`,
    student_id,
    type,
    issue_date: new Date().toISOString().split('T')[0],
    status: 'issued'
  };
  certificates.push(newCert);
  return sendSuccess(res, newCert, 'Certificate generated successfully', 201);
};

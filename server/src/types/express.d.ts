import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  schoolId: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

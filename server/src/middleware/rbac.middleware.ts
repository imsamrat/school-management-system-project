import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.js';
import { sendError } from '../utils/response.js';

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Authentication required', 401);
    }

    // Super Admin has all permissions implicitly
    if (user.roles.includes('Super Admin')) {
      return next();
    }

    if (!user.permissions.includes(permission)) {
      return sendError(res, `Missing required permission: ${permission}`, 403);
    }

    next();
  };
};

export const requireAnyPermission = (permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (user.roles.includes('Super Admin')) {
      return next();
    }

    const hasPermission = permissions.some((p) => user.permissions.includes(p));
    if (!hasPermission) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

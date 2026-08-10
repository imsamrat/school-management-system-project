import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express.js';
import { config } from '../config/env.js';
import { sendError } from '../utils/response.js';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      schoolId: decoded.schoolId,
      fullName: decoded.fullName,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
    };

    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

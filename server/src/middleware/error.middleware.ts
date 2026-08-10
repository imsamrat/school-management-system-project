import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${req.method} ${req.url}`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

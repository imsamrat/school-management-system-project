import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message = 'An error occurred', statusCode = 500, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

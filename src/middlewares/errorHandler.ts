import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  const mongoErr = err as MongoError;
  if (mongoErr.code === 11000 && mongoErr.keyValue) {
    const field = Object.keys(mongoErr.keyValue)[0];
    res.status(409).json({ success: false, message: `${field} already exists` });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};

export default errorHandler;

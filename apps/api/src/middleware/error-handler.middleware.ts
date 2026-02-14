import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { isDevelopment } from '../config/environment';

export interface HttpError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  // Log error
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || 'Internal server error',
      details: err.details,
      ...(isDevelopment && { stack: err.stack }),
    },
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};

/**
 * Create HTTP error
 */
export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): HttpError => {
  const error: HttpError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

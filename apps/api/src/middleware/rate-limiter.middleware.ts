import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Too many login attempts, please try again later',
    },
  },
});

/**
 * Code execution rate limiter
 */
export const codeExecutionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 executions per minute
  message: {
    success: false,
    error: {
      code: 'CODE_EXECUTION_LIMIT_EXCEEDED',
      message: 'Too many code executions, please wait a moment',
    },
  },
});

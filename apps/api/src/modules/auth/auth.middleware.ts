import { Request, Response, NextFunction } from 'express';
import { JWTStrategy } from './jwt.strategy';
import { db } from '../../config/database';
import { redis } from '../../config/redis';
import { logger } from '../../utils/logger';
import { User, JWTPayload } from '@code-platform/shared-types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to verify JWT access token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let payload: JWTPayload;
    try {
      payload = JWTStrategy.verifyAccessToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
      });
      return;
    }

    // Try to get user from Redis cache
    const cachedUser = await redis.get(`user:${payload.userId}`);

    let user: User;

    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      // Get user from database
      const result = await db.query<User>(
        `SELECT id, email, role, first_name as "firstName", last_name as "lastName",
                avatar_url as "avatarUrl", is_active as "isActive",
                is_email_verified as "isEmailVerified", created_at as "createdAt",
                updated_at as "updatedAt", last_login_at as "lastLoginAt"
         FROM users WHERE id = $1`,
        [payload.userId]
      );

      user = result.rows[0];

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      // Cache user for 15 minutes
      await redis.set(`user:${user.id}`, JSON.stringify(user), 15 * 60);
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Account is disabled',
        },
      });
      return;
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error: any) {
    logger.error('Authentication middleware error', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const payload = JWTStrategy.verifyAccessToken(token);

        // Get user from cache or database
        const cachedUser = await redis.get(`user:${payload.userId}`);
        let user: User;

        if (cachedUser) {
          user = JSON.parse(cachedUser);
        } else {
          const result = await db.query<User>(
            `SELECT id, email, role, first_name as "firstName", last_name as "lastName",
                    avatar_url as "avatarUrl", is_active as "isActive"
             FROM users WHERE id = $1`,
            [payload.userId]
          );
          user = result.rows[0];

          if (user) {
            await redis.set(`user:${user.id}`, JSON.stringify(user), 15 * 60);
          }
        }

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but continue without user
        logger.debug('Optional auth: invalid token');
      }
    }

    next();
  } catch (error: any) {
    logger.error('Optional authentication error', { error: error.message });
    next();
  }
};

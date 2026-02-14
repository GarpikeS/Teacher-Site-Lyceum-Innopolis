import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@code-platform/shared-types';
import { logger } from '../utils/logger';

/**
 * Middleware to require specific role(s) for route access
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // User must be authenticated first (checked by authenticate middleware)
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Access denied', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource',
        },
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to require student role
 */
export const requireStudent = requireRole(UserRole.STUDENT);

/**
 * Middleware to require teacher role
 */
export const requireTeacher = requireRole(UserRole.TEACHER);

/**
 * Middleware to require admin role
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware to require teacher or admin role
 */
export const requireTeacherOrAdmin = requireRole(UserRole.TEACHER, UserRole.ADMIN);

/**
 * Check if user owns the resource
 * Compares req.user.id with req.params.userId or req.params.id
 */
export const requireOwnership = (paramName: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const resourceUserId = req.params[paramName];

    // Admin can access everything
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    // Check if user owns the resource
    if (req.user.id !== resourceUserId) {
      logger.warn('Ownership check failed', {
        userId: req.user.id,
        resourceUserId,
        path: req.path,
      });

      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only access your own resources',
        },
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to require ownership OR specific role
 */
export const requireOwnershipOr = (paramName: string, ...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const resourceUserId = req.params[paramName];

    // Check if user has required role
    if (roles.includes(req.user.role)) {
      next();
      return;
    }

    // Check if user owns the resource
    if (req.user.id === resourceUserId) {
      next();
      return;
    }

    logger.warn('Authorization check failed', {
      userId: req.user.id,
      userRole: req.user.role,
      resourceUserId,
      requiredRoles: roles,
      path: req.path,
    });

    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource',
      },
    });
  };
};

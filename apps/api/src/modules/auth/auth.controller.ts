import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { logger } from '../../utils/logger';
import { CreateUserDto, LoginCredentials } from '@code-platform/shared-types';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateUserDto = req.body;

      // Basic validation
      if (!dto.email || !dto.password || !dto.firstName || !dto.lastName) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
          },
        });
      }

      const { user, tokens } = await AuthService.register(dto);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error: any) {
      logger.error('Registration error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message || 'Registration failed',
        },
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: LoginCredentials = req.body;

      if (!credentials.email || !credentials.password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required',
          },
        });
      }

      const { user, tokens } = await AuthService.login(credentials);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error: any) {
      logger.error('Login error', { error: error.message });
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message || 'Authentication failed',
        },
      });
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required',
          },
        });
      }

      await AuthService.logout(refreshToken);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logger.error('Logout error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message || 'Logout failed',
        },
      });
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Refresh token is required',
          },
        });
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error: any) {
      logger.error('Token refresh error', { error: error.message });
      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REFRESH_ERROR',
          message: error.message || 'Token refresh failed',
        },
      });
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      // User is already attached by auth middleware
      const user = (req as any).user;

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      logger.error('Get current user error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get current user',
        },
      });
    }
  }
}

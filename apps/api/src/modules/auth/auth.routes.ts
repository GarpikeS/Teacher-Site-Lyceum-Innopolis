import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', AuthController.register);

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
router.post('/login', AuthController.login);

/**
 * POST /api/v1/auth/logout
 * Logout and revoke refresh token
 */
router.post('/logout', AuthController.logout);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', AuthController.refresh);

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, AuthController.getMe);

export default router;

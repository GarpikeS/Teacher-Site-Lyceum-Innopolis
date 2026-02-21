import bcrypt from 'bcryptjs';
import { db } from '../../config/database';
import { redis } from '../../config/redis';
import { JWTStrategy } from './jwt.strategy';
import { logger } from '../../utils/logger';
import {
  User,
  CreateUserDto,
  LoginCredentials,
  AuthTokens,
  JWTPayload,
  UserRole,
} from '@code-platform/shared-types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(dto: CreateUserDto): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const result = await db.query<User>(
      `INSERT INTO users (email, password_hash, role, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, first_name as "firstName", last_name as "lastName",
                 avatar_url as "avatarUrl", is_active as "isActive",
                 is_email_verified as "isEmailVerified", created_at as "createdAt",
                 updated_at as "updatedAt"`,
      [dto.email, passwordHash, UserRole.STUDENT, dto.firstName, dto.lastName]
    );

    const user = result.rows[0];

    // Generate tokens
    const tokens = await this.generateTokens(user);

    logger.info('User registered', { userId: user.id, email: user.email });

    return { user, tokens };
  }

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // Find user
    const result = await db.query<User & { password_hash: string }>(
      `SELECT id, email, password_hash, role, first_name as "firstName",
              last_name as "lastName", avatar_url as "avatarUrl", is_active as "isActive",
              is_email_verified as "isEmailVerified", created_at as "createdAt",
              updated_at as "updatedAt"
       FROM users WHERE email = $1`,
      [credentials.email]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    // Generate tokens
    const tokens = await this.generateTokens(userWithoutPassword as User);

    logger.info('User logged in', { userId: user.id, email: user.email });

    return { user: userWithoutPassword as User, tokens };
  }

  /**
   * Logout user (revoke refresh token)
   */
  static async logout(refreshToken: string): Promise<void> {
    await db.query(
      'UPDATE refresh_tokens SET is_revoked = true WHERE token = $1',
      [refreshToken]
    );

    logger.info('User logged out');
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // Verify refresh token
    let payload: JWTPayload;
    try {
      payload = JWTStrategy.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }

    // Check if token exists and is not revoked
    const tokenResult = await db.query(
      `SELECT id, is_revoked as "isRevoked", expires_at as "expiresAt"
       FROM refresh_tokens
       WHERE token = $1`,
      [refreshToken]
    );

    const tokenData = tokenResult.rows[0];

    if (!tokenData) {
      throw new Error('Refresh token not found');
    }

    if (tokenData.isRevoked) {
      throw new Error('Refresh token has been revoked');
    }

    if (new Date(tokenData.expiresAt) < new Date()) {
      throw new Error('Refresh token has expired');
    }

    // Get user
    const userResult = await db.query<User>(
      `SELECT id, email, role, first_name as "firstName", last_name as "lastName",
              avatar_url as "avatarUrl", is_active as "isActive"
       FROM users WHERE id = $1`,
      [payload.userId]
    );

    const user = userResult.rows[0];

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    // Revoke old refresh token
    await db.query(
      'UPDATE refresh_tokens SET is_revoked = true WHERE token = $1',
      [refreshToken]
    );

    logger.info('Token refreshed', { userId: user.id });

    return tokens;
  }

  /**
   * Generate access and refresh tokens
   */
  private static async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JWTStrategy.generateAccessToken(payload);
    const refreshToken = JWTStrategy.generateRefreshToken(payload);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Cache user in Redis for fast access (15 minutes)
    try {
      await redis.set(
        `user:${user.id}`,
        JSON.stringify(user),
        15 * 60 // 15 minutes
      );
    } catch (cacheError) {
      logger.warn('Failed to cache user in Redis', { userId: user.id, error: cacheError });
    }

    return { accessToken, refreshToken };
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const result = await db.query<{ password_hash: string }>(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Неверный текущий пароль');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);

    logger.info('Password changed', { userId });
  }

  /**
   * Verify email (placeholder - implement email verification logic)
   */
  static async verifyEmail(_token: string): Promise<void> {
    // TODO: Implement email verification logic
    throw new Error('Email verification not implemented');
  }

  /**
   * Request password reset (placeholder)
   */
  static async requestPasswordReset(_email: string): Promise<void> {
    // TODO: Implement password reset logic
    throw new Error('Password reset not implemented');
  }

  /**
   * Reset password (placeholder)
   */
  static async resetPassword(_token: string, _newPassword: string): Promise<void> {
    // TODO: Implement password reset logic
    throw new Error('Password reset not implemented');
  }
}

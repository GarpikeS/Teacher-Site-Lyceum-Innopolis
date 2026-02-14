import { UserRole } from '../enums';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  metadata?: Record<string, any>;
}

export interface UserProfile extends User {
  // Extended profile fields can be added here
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterDto extends CreateUserDto {
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;
}

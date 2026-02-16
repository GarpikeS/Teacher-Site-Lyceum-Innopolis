import { apiClient } from './api-client';
import {
  LoginCredentials,
  RegisterDto,
  LoginResponse,
  User,
} from '@code-platform/shared-types';

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<LoginResponse> {
    let response;
    try {
      response = await apiClient.post<LoginResponse>('/auth/register', data);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Ошибка регистрации';
      throw new Error(message);
    }

    if (response.success && response.data) {
      apiClient.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      return response.data;
    }

    throw new Error(response.error?.message || 'Registration failed');
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    let response;
    try {
      response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Ошибка входа';
      throw new Error(message);
    }

    if (response.success && response.data) {
      apiClient.setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      return response.data;
    }

    throw new Error(response.error?.message || 'Login failed');
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } finally {
      apiClient.clearTokens();
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
};

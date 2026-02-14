import { UsersModel } from './users.model';
import { createError } from '../../middleware/error-handler.middleware';
import { redis } from '../../config/redis';
import { User, UpdateUserDto, UserRole } from '@code-platform/shared-types';
import { logger } from '../../utils/logger';

export class UsersService {
  static async getAllUsers(page: number = 1, limit: number = 20, role?: string) {
    return UsersModel.findAll(page, limit, role);
  }

  static async getUserById(id: string): Promise<User> {
    const user = await UsersModel.findById(id);
    if (!user) {
      throw createError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  }

  static async getUserByEmail(email: string): Promise<User> {
    const user = await UsersModel.findByEmail(email);
    if (!user) {
      throw createError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  }

  static async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await UsersModel.update(id, dto);
    if (!user) {
      throw createError('User not found', 404, 'NOT_FOUND');
    }
    await redis.del(`user:${id}`).catch(() => {});
    logger.info('User profile updated', { userId: id });
    return user;
  }

  static async updateRole(id: string, role: UserRole): Promise<User> {
    const validRoles = [UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN];
    if (!validRoles.includes(role)) {
      throw createError('Invalid role', 400, 'VALIDATION_ERROR');
    }

    const user = await UsersModel.updateRole(id, role);
    if (!user) {
      throw createError('User not found', 404, 'NOT_FOUND');
    }
    await redis.del(`user:${id}`).catch(() => {});
    logger.info('User role updated', { userId: id, role });
    return user;
  }

  static async toggleActive(id: string, isActive: boolean): Promise<User> {
    const user = await UsersModel.setActive(id, isActive);
    if (!user) {
      throw createError('User not found', 404, 'NOT_FOUND');
    }
    await redis.del(`user:${id}`).catch(() => {});
    logger.info('User active status changed', { userId: id, isActive });
    return user;
  }

  static async deleteUser(id: string): Promise<void> {
    const deleted = await UsersModel.delete(id);
    if (!deleted) {
      throw createError('User not found', 404, 'NOT_FOUND');
    }
    await redis.del(`user:${id}`).catch(() => {});
    logger.info('User deleted', { userId: id });
  }
}

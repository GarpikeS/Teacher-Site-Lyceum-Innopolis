import { ClassesModel } from './classes.model';
import { logger } from '../../utils/logger';
import {
  Class,
  ClassWithStudents,
  CreateClassDto,
  UpdateClassDto,
  ClassStatistics,
  UserRole,
} from '@code-platform/shared-types';

export class ClassesService {
  /**
   * Get classes for a teacher (or all for admin)
   */
  static async getClasses(userId: string, role: UserRole): Promise<ClassWithStudents[]> {
    if (role === UserRole.ADMIN) {
      return await ClassesModel.findAll();
    }
    return await ClassesModel.findByTeacherId(userId);
  }

  /**
   * Get class by ID with students
   */
  static async getClassById(id: string, userId: string, role: UserRole): Promise<ClassWithStudents> {
    const classData = await ClassesModel.findByIdWithStudents(id);

    if (!classData) {
      throw new Error('Class not found');
    }

    // Only owner teacher or admin can view
    if (role !== UserRole.ADMIN && classData.teacherId !== userId) {
      throw new Error('You do not have access to this class');
    }

    return classData;
  }

  /**
   * Create class
   */
  static async createClass(dto: CreateClassDto, teacherId: string): Promise<Class> {
    const classData = await ClassesModel.create(dto, teacherId);
    logger.info('Class created', { classId: classData.id, teacherId });
    return classData;
  }

  /**
   * Update class
   */
  static async updateClass(id: string, dto: UpdateClassDto, userId: string, role: UserRole): Promise<Class> {
    const existing = await ClassesModel.findById(id);

    if (!existing) {
      throw new Error('Class not found');
    }

    if (role !== UserRole.ADMIN && existing.teacherId !== userId) {
      throw new Error('You do not have permission to update this class');
    }

    const updated = await ClassesModel.update(id, dto);

    if (!updated) {
      throw new Error('Failed to update class');
    }

    logger.info('Class updated', { classId: id });
    return updated;
  }

  /**
   * Delete class
   */
  static async deleteClass(id: string, userId: string, role: UserRole): Promise<void> {
    const existing = await ClassesModel.findById(id);

    if (!existing) {
      throw new Error('Class not found');
    }

    if (role !== UserRole.ADMIN && existing.teacherId !== userId) {
      throw new Error('You do not have permission to delete this class');
    }

    await ClassesModel.delete(id);
    logger.info('Class deleted', { classId: id });
  }

  /**
   * Add student to class
   */
  static async addStudent(classId: string, studentId: string, userId: string, role: UserRole): Promise<void> {
    const existing = await ClassesModel.findById(classId);

    if (!existing) {
      throw new Error('Class not found');
    }

    if (role !== UserRole.ADMIN && existing.teacherId !== userId) {
      throw new Error('You do not have permission to manage this class');
    }

    const alreadyInClass = await ClassesModel.isStudentInClass(classId, studentId);
    if (alreadyInClass) {
      throw new Error('Student is already in this class');
    }

    await ClassesModel.addStudent(classId, studentId);
    logger.info('Student added to class', { classId, studentId });
  }

  /**
   * Remove student from class
   */
  static async removeStudent(classId: string, studentId: string, userId: string, role: UserRole): Promise<void> {
    const existing = await ClassesModel.findById(classId);

    if (!existing) {
      throw new Error('Class not found');
    }

    if (role !== UserRole.ADMIN && existing.teacherId !== userId) {
      throw new Error('You do not have permission to manage this class');
    }

    const removed = await ClassesModel.removeStudent(classId, studentId);
    if (!removed) {
      throw new Error('Student is not in this class');
    }

    logger.info('Student removed from class', { classId, studentId });
  }

  /**
   * Get class statistics
   */
  static async getStatistics(classId: string, userId: string, role: UserRole): Promise<ClassStatistics> {
    const existing = await ClassesModel.findById(classId);

    if (!existing) {
      throw new Error('Class not found');
    }

    if (role !== UserRole.ADMIN && existing.teacherId !== userId) {
      throw new Error('You do not have access to this class statistics');
    }

    const stats = await ClassesModel.getStatistics(classId);

    if (!stats) {
      throw new Error('Failed to get statistics');
    }

    return stats;
  }
}

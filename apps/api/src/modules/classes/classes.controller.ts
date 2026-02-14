import { Request, Response } from 'express';
import { ClassesService } from './classes.service';
import { logger } from '../../utils/logger';
import { CreateClassDto, UpdateClassDto, AddStudentDto } from '@code-platform/shared-types';

export class ClassesController {
  /**
   * GET /api/v1/classes
   */
  static async getClasses(req: Request, res: Response) {
    try {
      const user = req.user!;
      const classes = await ClassesService.getClasses(user.id, user.role);

      res.json({
        success: true,
        data: classes,
      });
    } catch (error: any) {
      logger.error('Get classes error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get classes',
        },
      });
    }
  }

  /**
   * GET /api/v1/classes/:id
   */
  static async getClassById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;
      const classData = await ClassesService.getClassById(id, user.id, user.role);

      res.json({
        success: true,
        data: classData,
      });
    } catch (error: any) {
      logger.error('Get class error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 403;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message,
        },
      });
    }
  }

  /**
   * POST /api/v1/classes
   */
  static async createClass(req: Request, res: Response) {
    try {
      const dto: CreateClassDto = req.body;
      const user = req.user!;

      if (!dto.name) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Class name is required',
          },
        });
      }

      const classData = await ClassesService.createClass(dto, user.id);

      res.status(201).json({
        success: true,
        data: classData,
      });
    } catch (error: any) {
      logger.error('Create class error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error.message || 'Failed to create class',
        },
      });
    }
  }

  /**
   * PATCH /api/v1/classes/:id
   */
  static async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateClassDto = req.body;
      const user = req.user!;

      const classData = await ClassesService.updateClass(id, dto, user.id, user.role);

      res.json({
        success: true,
        data: classData,
      });
    } catch (error: any) {
      logger.error('Update class error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'UPDATE_ERROR',
          message: error.message || 'Failed to update class',
        },
      });
    }
  }

  /**
   * DELETE /api/v1/classes/:id
   */
  static async deleteClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      await ClassesService.deleteClass(id, user.id, user.role);

      res.json({
        success: true,
        message: 'Class deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete class error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'DELETE_ERROR',
          message: error.message || 'Failed to delete class',
        },
      });
    }
  }

  /**
   * POST /api/v1/classes/:id/students
   */
  static async addStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: AddStudentDto = req.body;
      const user = req.user!;

      if (!dto.studentId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Student ID is required',
          },
        });
      }

      await ClassesService.addStudent(id, dto.studentId, user.id, user.role);

      res.status(201).json({
        success: true,
        message: 'Student added to class successfully',
      });
    } catch (error: any) {
      logger.error('Add student error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'ADD_STUDENT_ERROR',
          message: error.message || 'Failed to add student',
        },
      });
    }
  }

  /**
   * DELETE /api/v1/classes/:id/students/:studentId
   */
  static async removeStudent(req: Request, res: Response) {
    try {
      const { id, studentId } = req.params;
      const user = req.user!;

      await ClassesService.removeStudent(id, studentId, user.id, user.role);

      res.json({
        success: true,
        message: 'Student removed from class successfully',
      });
    } catch (error: any) {
      logger.error('Remove student error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'REMOVE_STUDENT_ERROR',
          message: error.message || 'Failed to remove student',
        },
      });
    }
  }

  /**
   * GET /api/v1/classes/:id/statistics
   */
  static async getStatistics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      const stats = await ClassesService.getStatistics(id, user.id, user.role);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Get class statistics error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: {
          code: status === 404 ? 'NOT_FOUND' : 'STATISTICS_ERROR',
          message: error.message || 'Failed to get statistics',
        },
      });
    }
  }
}

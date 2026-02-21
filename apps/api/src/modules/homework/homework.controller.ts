import { Request, Response } from 'express';
import { HomeworkService } from './homework.service';
import { logger } from '../../utils/logger';
import { CreateHomeworkDto, UpdateHomeworkDto } from '@code-platform/shared-types';

export class HomeworkController {
  /**
   * GET /api/v1/homework/my — student's homework
   */
  static async getMyHomework(req: Request, res: Response) {
    try {
      const user = req.user!;
      const homework = await HomeworkService.getMyHomework(user.id);

      res.json({ success: true, data: homework });
    } catch (error: any) {
      logger.error('Get my homework error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get homework' },
      });
    }
  }

  /**
   * GET /api/v1/homework/teacher — teacher's homework list
   */
  static async getTeacherHomework(req: Request, res: Response) {
    try {
      const user = req.user!;
      const homework = await HomeworkService.getTeacherHomework(user.id);

      res.json({ success: true, data: homework });
    } catch (error: any) {
      logger.error('Get teacher homework error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get homework' },
      });
    }
  }

  /**
   * GET /api/v1/homework/:id
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const homework = await HomeworkService.getHomeworkById(id);

      res.json({ success: true, data: homework });
    } catch (error: any) {
      logger.error('Get homework error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 500;
      res.status(status).json({
        success: false,
        error: { code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * POST /api/v1/homework
   */
  static async create(req: Request, res: Response) {
    try {
      const dto: CreateHomeworkDto = req.body;
      const user = req.user!;

      if (!dto.title || !dto.classId || !dto.assignmentTitle || !dto.assignmentDescription || !dto.testCases) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' },
        });
      }

      const homework = await HomeworkService.createHomework(dto, user.id);

      res.status(201).json({ success: true, data: homework });
    } catch (error: any) {
      logger.error('Create homework error', { error: error.message });
      res.status(400).json({
        success: false,
        error: { code: 'CREATE_ERROR', message: error.message || 'Failed to create homework' },
      });
    }
  }

  /**
   * PATCH /api/v1/homework/:id
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateHomeworkDto = req.body;
      const user = req.user!;

      const homework = await HomeworkService.updateHomework(id, dto, user.id, user.role);

      res.json({ success: true, data: homework });
    } catch (error: any) {
      logger.error('Update homework error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: { code: status === 404 ? 'NOT_FOUND' : 'UPDATE_ERROR', message: error.message },
      });
    }
  }

  /**
   * DELETE /api/v1/homework/:id
   */
  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      await HomeworkService.deleteHomework(id, user.id, user.role);

      res.json({ success: true, message: 'Homework deleted successfully' });
    } catch (error: any) {
      logger.error('Delete homework error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: { code: status === 404 ? 'NOT_FOUND' : 'DELETE_ERROR', message: error.message },
      });
    }
  }

  /**
   * GET /api/v1/homework/:id/submissions
   */
  static async getSubmissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      const submissions = await HomeworkService.getSubmissions(id, user.id, user.role);

      res.json({ success: true, data: submissions });
    } catch (error: any) {
      logger.error('Get homework submissions error', { error: error.message });
      const status = error.message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: { code: status === 404 ? 'NOT_FOUND' : 'SUBMISSIONS_ERROR', message: error.message },
      });
    }
  }
}

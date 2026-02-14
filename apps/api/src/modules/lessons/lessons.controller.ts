import { Request, Response } from 'express';
import { LessonsService } from './lessons.service';
import { logger } from '../../utils/logger';
import { CreateLessonDto, UpdateLessonDto } from '@code-platform/shared-types';

export class LessonsController {
  static async getLessonsByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const user = req.user;
      const lessons = await LessonsService.getLessonsByCourseId(courseId, user?.id);
      res.json({ success: true, data: lessons });
    } catch (error: any) {
      logger.error('Get lessons error', { error: error.message });
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to get lessons' } });
    }
  }

  static async getLessonById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lesson = await LessonsService.getLessonById(id);
      res.json({ success: true, data: lesson });
    } catch (error: any) {
      logger.error('Get lesson error', { error: error.message });
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
  }

  static async createLesson(req: Request, res: Response) {
    try {
      const dto: CreateLessonDto = req.body;
      const lesson = await LessonsService.createLesson(dto);
      res.status(201).json({ success: true, data: lesson });
    } catch (error: any) {
      logger.error('Create lesson error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
    }
  }

  static async updateLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateLessonDto = req.body;
      const lesson = await LessonsService.updateLesson(id, dto);
      res.json({ success: true, data: lesson });
    } catch (error: any) {
      logger.error('Update lesson error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
    }
  }

  static async deleteLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await LessonsService.deleteLesson(id);
      res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error: any) {
      logger.error('Delete lesson error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
    }
  }

  static async startLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;
      const progress = await LessonsService.startLesson(user.id, id);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      logger.error('Start lesson error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'START_ERROR', message: error.message } });
    }
  }

  static async completeLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;
      const progress = await LessonsService.completeLesson(user.id, id);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      logger.error('Complete lesson error', { error: error.message });
      res.status(400).json({ success: false, error: { code: 'COMPLETE_ERROR', message: error.message } });
    }
  }
}

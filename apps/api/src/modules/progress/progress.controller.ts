import { Request, Response } from 'express';
import { ProgressService } from './progress.service';
import { logger } from '../../utils/logger';

export class ProgressController {
  static async getMyProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const progress = await ProgressService.getMyProgress(userId);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      logger.error('Get progress error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get progress' },
      });
    }
  }

  static async getCourseProgress(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const userId = (req as any).user.id;
      const progress = await ProgressService.getCourseProgress(courseId, userId);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      logger.error('Get course progress error', { error: error.message });
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: { code: error.code || 'INTERNAL_ERROR', message: error.message },
      });
    }
  }
}

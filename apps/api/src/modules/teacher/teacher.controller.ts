import { Request, Response } from 'express';
import { TeacherService } from './teacher.service';
import { logger } from '../../utils/logger';

export class TeacherController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await TeacherService.getDashboard(userId);
      res.json({ success: true, data });
    } catch (error: any) {
      logger.error('Teacher dashboard error', { error: error.message });
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to load dashboard' },
      });
    }
  }
}

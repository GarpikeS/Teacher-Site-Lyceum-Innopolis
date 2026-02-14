import { ProgressModel } from './progress.model';
import { createError } from '../../middleware/error-handler.middleware';

export class ProgressService {
  static async getMyProgress(userId: string) {
    const summary = await ProgressModel.getUserSummary(userId);
    const recentActivity = await ProgressModel.getRecentActivity(userId);

    return {
      ...summary,
      recentActivity,
    };
  }

  static async getCourseProgress(courseId: string, userId: string) {
    const progress = await ProgressModel.getCourseProgress(courseId, userId);
    if (!progress) {
      throw createError('Course not found', 404, 'NOT_FOUND');
    }
    return progress;
  }
}

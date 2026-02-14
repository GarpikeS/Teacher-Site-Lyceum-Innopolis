import { LessonsModel } from './lessons.model';
import { logger } from '../../utils/logger';
import {
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  LessonWithProgress,
  UserProgress,
} from '@code-platform/shared-types';

export class LessonsService {
  static async getLessonsByCourseId(
    courseId: string,
    userId?: string,
    includeUnpublished: boolean = false
  ): Promise<Lesson[] | LessonWithProgress[]> {
    if (userId) {
      return await LessonsModel.findByCourseIdWithProgress(courseId, userId);
    }
    return await LessonsModel.findByCourseId(courseId, includeUnpublished);
  }

  static async getLessonById(id: string): Promise<Lesson> {
    const lesson = await LessonsModel.findById(id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return lesson;
  }

  static async createLesson(dto: CreateLessonDto): Promise<Lesson> {
    const lesson = await LessonsModel.create(dto);
    logger.info('Lesson created', { lessonId: lesson.id });
    return lesson;
  }

  static async updateLesson(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await LessonsModel.update(id, dto);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    logger.info('Lesson updated', { lessonId: id });
    return lesson;
  }

  static async deleteLesson(id: string): Promise<void> {
    const deleted = await LessonsModel.delete(id);
    if (!deleted) {
      throw new Error('Lesson not found');
    }
    logger.info('Lesson deleted', { lessonId: id });
  }

  static async startLesson(userId: string, lessonId: string): Promise<UserProgress> {
    return await LessonsModel.startLesson(userId, lessonId);
  }

  static async completeLesson(userId: string, lessonId: string): Promise<UserProgress> {
    return await LessonsModel.completeLesson(userId, lessonId);
  }
}

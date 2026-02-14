import { Request, Response } from 'express';
import { CoursesService } from './courses.service';
import { logger } from '../../utils/logger';
import { CreateCourseDto, UpdateCourseDto } from '@code-platform/shared-types';

export class CoursesController {
  /**
   * GET /api/v1/courses
   * Get all courses
   */
  static async getAllCourses(req: Request, res: Response) {
    try {
      const user = req.user;
      const includeUnpublished = user?.role === 'admin' || user?.role === 'teacher';

      let courses;

      if (user) {
        // Get courses with progress for authenticated users
        courses = await CoursesService.getCoursesWithProgress(user.id);
      } else {
        // Get only published courses for guests
        courses = await CoursesService.getAllCourses(false);
      }

      res.json({
        success: true,
        data: courses,
      });
    } catch (error: any) {
      logger.error('Get courses error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get courses',
        },
      });
    }
  }

  /**
   * GET /api/v1/courses/:id
   * Get course by ID
   */
  static async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const course = await CoursesService.getCourseById(id);

      res.json({
        success: true,
        data: course,
      });
    } catch (error: any) {
      logger.error('Get course error', { error: error.message });
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'Course not found',
        },
      });
    }
  }

  /**
   * POST /api/v1/courses
   * Create course (Admin only)
   */
  static async createCourse(req: Request, res: Response) {
    try {
      const dto: CreateCourseDto = req.body;
      const user = req.user!;

      // Basic validation
      if (!dto.slug || !dto.title || !dto.language || dto.orderIndex === undefined) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
          },
        });
      }

      const course = await CoursesService.createCourse(dto, user.id);

      res.status(201).json({
        success: true,
        data: course,
      });
    } catch (error: any) {
      logger.error('Create course error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error.message || 'Failed to create course',
        },
      });
    }
  }

  /**
   * PATCH /api/v1/courses/:id
   * Update course (Admin only)
   */
  static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto: UpdateCourseDto = req.body;

      const course = await CoursesService.updateCourse(id, dto);

      res.json({
        success: true,
        data: course,
      });
    } catch (error: any) {
      logger.error('Update course error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error.message || 'Failed to update course',
        },
      });
    }
  }

  /**
   * DELETE /api/v1/courses/:id
   * Delete course (Admin only)
   */
  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await CoursesService.deleteCourse(id);

      res.json({
        success: true,
        message: 'Course deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete course error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error.message || 'Failed to delete course',
        },
      });
    }
  }

  /**
   * POST /api/v1/courses/:id/enroll
   * Enroll in course
   */
  static async enrollInCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      const enrollment = await CoursesService.enrollInCourse(user.id, id);

      res.status(201).json({
        success: true,
        data: enrollment,
      });
    } catch (error: any) {
      logger.error('Enroll in course error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'ENROLLMENT_ERROR',
          message: error.message || 'Failed to enroll in course',
        },
      });
    }
  }

  /**
   * GET /api/v1/courses/:id/enrollment
   * Get user enrollment status
   */
  static async getEnrollment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user!;

      const enrollment = await CoursesService.getEnrollment(user.id, id);

      res.json({
        success: true,
        data: enrollment,
      });
    } catch (error: any) {
      logger.error('Get enrollment error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get enrollment',
        },
      });
    }
  }
}

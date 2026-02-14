import { CoursesModel } from './courses.model';
import { logger } from '../../utils/logger';
import {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  CourseWithProgress,
  CourseEnrollment,
} from '@code-platform/shared-types';

export class CoursesService {
  /**
   * Get all courses
   */
  static async getAllCourses(includeUnpublished: boolean = false): Promise<Course[]> {
    return await CoursesModel.findAll(includeUnpublished);
  }

  /**
   * Get courses with user progress
   */
  static async getCoursesWithProgress(userId: string): Promise<CourseWithProgress[]> {
    return await CoursesModel.findAllWithProgress(userId);
  }

  /**
   * Get course by ID
   */
  static async getCourseById(id: string): Promise<Course> {
    const course = await CoursesModel.findById(id);

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  /**
   * Get course by slug
   */
  static async getCourseBySlug(slug: string): Promise<Course> {
    const course = await CoursesModel.findBySlug(slug);

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  /**
   * Create course
   */
  static async createCourse(dto: CreateCourseDto, createdBy: string): Promise<Course> {
    // Check if slug already exists
    const existingCourse = await CoursesModel.findBySlug(dto.slug);
    if (existingCourse) {
      throw new Error('Course with this slug already exists');
    }

    const course = await CoursesModel.create(dto, createdBy);

    logger.info('Course created', { courseId: course.id, slug: course.slug });

    return course;
  }

  /**
   * Update course
   */
  static async updateCourse(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await CoursesModel.update(id, dto);

    if (!course) {
      throw new Error('Course not found');
    }

    logger.info('Course updated', { courseId: id });

    return course;
  }

  /**
   * Delete course
   */
  static async deleteCourse(id: string): Promise<void> {
    const deleted = await CoursesModel.delete(id);

    if (!deleted) {
      throw new Error('Course not found');
    }

    logger.info('Course deleted', { courseId: id });
  }

  /**
   * Enroll user in course
   */
  static async enrollInCourse(userId: string, courseId: string): Promise<CourseEnrollment> {
    // Check if course exists
    const course = await CoursesModel.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (!course.isPublished) {
      throw new Error('Cannot enroll in unpublished course');
    }

    // Check if already enrolled
    const isEnrolled = await CoursesModel.isEnrolled(userId, courseId);
    if (isEnrolled) {
      // Return existing enrollment
      const enrollment = await CoursesModel.getEnrollment(userId, courseId);
      if (enrollment) {
        return enrollment;
      }
    }

    const enrollment = await CoursesModel.enroll(userId, courseId);

    logger.info('User enrolled in course', { userId, courseId });

    return enrollment;
  }

  /**
   * Get user enrollment
   */
  static async getEnrollment(userId: string, courseId: string): Promise<CourseEnrollment | null> {
    return await CoursesModel.getEnrollment(userId, courseId);
  }

  /**
   * Check if user is enrolled
   */
  static async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    return await CoursesModel.isEnrolled(userId, courseId);
  }
}

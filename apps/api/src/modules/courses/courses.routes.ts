import { Router } from 'express';
import { CoursesController } from './courses.controller';
import { authenticate, optionalAuthenticate } from '../auth/auth.middleware';
import { requireAdmin } from '../../middleware/rbac.middleware';

const router = Router();

/**
 * GET /api/v1/courses
 * Get all courses (public with optional auth for progress)
 */
router.get('/', optionalAuthenticate, CoursesController.getAllCourses);

/**
 * GET /api/v1/courses/:id
 * Get course by ID (public)
 */
router.get('/:id', CoursesController.getCourseById);

/**
 * POST /api/v1/courses
 * Create course (Admin only)
 */
router.post('/', authenticate, requireAdmin, CoursesController.createCourse);

/**
 * PATCH /api/v1/courses/:id
 * Update course (Admin only)
 */
router.patch('/:id', authenticate, requireAdmin, CoursesController.updateCourse);

/**
 * DELETE /api/v1/courses/:id
 * Delete course (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, CoursesController.deleteCourse);

/**
 * POST /api/v1/courses/:id/enroll
 * Enroll in course (Authenticated)
 */
router.post('/:id/enroll', authenticate, CoursesController.enrollInCourse);

/**
 * GET /api/v1/courses/:id/enrollment
 * Get enrollment status (Authenticated)
 */
router.get('/:id/enrollment', authenticate, CoursesController.getEnrollment);

export default router;

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/environment';
import { morganStream } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware';
import { apiLimiter } from './middleware/rate-limiter.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import coursesRoutes from './modules/courses/courses.routes';
import lessonsRoutes from './modules/lessons/lessons.routes';
import assignmentsRoutes from './modules/assignments/assignments.routes';
import submissionsRoutes from './modules/submissions/submissions.routes';
import progressRoutes from './modules/progress/progress.routes';
import codeRoutes from './modules/code/code.routes';
import classesRoutes from './modules/classes/classes.routes';
import achievementsRoutes from './modules/achievements/achievements.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import usersRoutes from './modules/users/users.routes';
import teacherRoutes from './modules/teacher/teacher.routes';
import homeworkRoutes from './modules/homework/homework.routes';

export const createApp = (): Application => {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================

  // Helmet for security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ============================================
  // GENERAL MIDDLEWARE
  // ============================================

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP request logger
  app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms',
      { stream: morganStream }
    )
  );

  // ============================================
  // HEALTH CHECK
  // ============================================

  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    });
  });

  // ============================================
  // API ROUTES
  // ============================================

  // Apply rate limiting to all API routes
  app.use('/api', apiLimiter);

  // API v1 routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/courses', coursesRoutes);
  app.use('/api/v1/lessons', lessonsRoutes);
  app.use('/api/v1/assignments', assignmentsRoutes);
  app.use('/api/v1', submissionsRoutes);
  app.use('/api/v1/progress', progressRoutes);
  app.use('/api/v1/code', codeRoutes);
  app.use('/api/v1/classes', classesRoutes);
  app.use('/api/v1/achievements', achievementsRoutes);
  app.use('/api/v1/notifications', notificationsRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/teacher', teacherRoutes);
  app.use('/api/v1/homework', homeworkRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

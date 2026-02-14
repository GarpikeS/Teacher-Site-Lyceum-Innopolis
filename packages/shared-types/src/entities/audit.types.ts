export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface CreateAuditLogDto {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export enum AuditAction {
  // User actions
  USER_LOGIN = 'user:login',
  USER_LOGOUT = 'user:logout',
  USER_REGISTER = 'user:register',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Course actions
  COURSE_CREATE = 'course:create',
  COURSE_UPDATE = 'course:update',
  COURSE_DELETE = 'course:delete',
  COURSE_PUBLISH = 'course:publish',
  COURSE_ENROLL = 'course:enroll',

  // Lesson actions
  LESSON_CREATE = 'lesson:create',
  LESSON_UPDATE = 'lesson:update',
  LESSON_DELETE = 'lesson:delete',
  LESSON_START = 'lesson:start',
  LESSON_COMPLETE = 'lesson:complete',

  // Assignment actions
  ASSIGNMENT_CREATE = 'assignment:create',
  ASSIGNMENT_UPDATE = 'assignment:update',
  ASSIGNMENT_DELETE = 'assignment:delete',

  // Submission actions
  SUBMISSION_CREATE = 'submission:create',
  SUBMISSION_REVIEW = 'submission:review',

  // Code execution
  CODE_EXECUTE = 'code:execute',
}

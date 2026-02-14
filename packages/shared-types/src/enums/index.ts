// ============================================
// USER ENUMS
// ============================================

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// ============================================
// COURSE ENUMS
// ============================================

export enum ProgrammingLanguage {
  PYTHON = 'python',
  CPP = 'cpp',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum GradeLevel {
  GRADE_7 = 7,
  GRADE_8 = 8,
  GRADE_9 = 9,
  GRADE_10 = 10,
  GRADE_11 = 11,
}

// ============================================
// LESSON ENUMS
// ============================================

export enum LessonStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// ============================================
// ASSIGNMENT ENUMS
// ============================================

export enum AssignmentType {
  CODE = 'code',
  QUIZ = 'quiz',
  PROJECT = 'project',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ValidationType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  HYBRID = 'hybrid',
}

// ============================================
// SUBMISSION ENUMS
// ============================================

export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed',
  ERROR = 'error',
  MANUAL_REVIEW = 'manual_review',
}

// ============================================
// NOTIFICATION ENUMS
// ============================================

export enum NotificationType {
  ASSIGNMENT = 'assignment',
  ACHIEVEMENT = 'achievement',
  FEEDBACK = 'feedback',
  SYSTEM = 'system',
}

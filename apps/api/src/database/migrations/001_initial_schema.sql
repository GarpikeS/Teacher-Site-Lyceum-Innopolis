-- Migration: 001_initial_schema
-- Description: Create all tables, enums, and indexes
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE programming_language AS ENUM ('python', 'cpp');
CREATE TYPE assignment_type AS ENUM ('code', 'quiz', 'project');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE validation_type AS ENUM ('automatic', 'manual', 'hybrid');
CREATE TYPE submission_status AS ENUM ('pending', 'running', 'passed', 'failed', 'error', 'manual_review');
CREATE TYPE lesson_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE notification_type AS ENUM ('assignment', 'achievement', 'feedback', 'system');

-- ============================================
-- TABLE: users
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================
-- TABLE: courses
-- ============================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  language programming_language NOT NULL,
  level VARCHAR(50) DEFAULT 'advanced',
  icon_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  estimated_hours INTEGER,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courses_language ON courses(language);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_order ON courses(order_index);
CREATE INDEX idx_courses_slug ON courses(slug);

-- ============================================
-- TABLE: lessons
-- ============================================

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  prerequisites UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_published ON lessons(is_published);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);

-- ============================================
-- TABLE: assignments
-- ============================================

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  assignment_type assignment_type NOT NULL DEFAULT 'code',
  difficulty difficulty_level,
  starter_code TEXT,
  test_cases JSONB,
  validation_type validation_type NOT NULL DEFAULT 'automatic',
  max_attempts INTEGER DEFAULT 0,
  time_limit_seconds INTEGER,
  memory_limit_mb INTEGER,
  points INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX idx_assignments_type ON assignments(assignment_type);
CREATE INDEX idx_assignments_published ON assignments(is_published);
CREATE INDEX idx_assignments_order ON assignments(lesson_id, order_index);

-- ============================================
-- TABLE: submissions
-- ============================================

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language programming_language NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending',
  test_results JSONB,
  execution_time_ms INTEGER,
  memory_used_mb DECIMAL(10, 2),
  score INTEGER DEFAULT 0,
  max_score INTEGER,
  teacher_feedback TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  submitted_at TIMESTAMP DEFAULT NOW(),
  graded_at TIMESTAMP
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_pending_review ON submissions(status) WHERE status = 'manual_review';
CREATE INDEX idx_submissions_user_assignment ON submissions(user_id, assignment_id);

-- ============================================
-- TABLE: user_progress
-- ============================================

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status lesson_status NOT NULL DEFAULT 'not_started',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_spent_seconds INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_progress_status ON user_progress(status);

-- ============================================
-- TABLE: course_enrollments
-- ============================================

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
  last_accessed_at TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- ============================================
-- TABLE: achievements
-- ============================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  badge_color VARCHAR(7),
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_achievements_slug ON achievements(slug);
CREATE INDEX idx_achievements_active ON achievements(is_active);

-- ============================================
-- TABLE: user_achievements
-- ============================================

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);

-- ============================================
-- TABLE: notifications
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  notification_type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false,
  link_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- TABLE: classes
-- ============================================

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  academic_year VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_active ON classes(is_active);

-- ============================================
-- TABLE: class_students
-- ============================================

CREATE TABLE class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

CREATE INDEX idx_class_students_class ON class_students(class_id);
CREATE INDEX idx_class_students_student ON class_students(student_id);

-- ============================================
-- TABLE: refresh_tokens
-- ============================================

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_revoked BOOLEAN DEFAULT false
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ============================================
-- TABLE: audit_logs
-- ============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- TABLE COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User accounts for students, teachers, and admins';
COMMENT ON TABLE courses IS 'Programming courses (Python, C++)';
COMMENT ON TABLE lessons IS 'Individual lessons within courses';
COMMENT ON TABLE assignments IS 'Coding assignments/exercises for lessons';
COMMENT ON TABLE submissions IS 'Student code submissions for assignments';
COMMENT ON TABLE user_progress IS 'Track student progress through lessons';
COMMENT ON TABLE course_enrollments IS 'Student enrollments in courses';
COMMENT ON TABLE achievements IS 'Gamification badges and achievements';
COMMENT ON TABLE user_achievements IS 'Achievements earned by users';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE classes IS 'Teacher-managed classes/groups';
COMMENT ON TABLE class_students IS 'Students assigned to classes';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';
COMMENT ON TABLE audit_logs IS 'Audit trail of user actions';

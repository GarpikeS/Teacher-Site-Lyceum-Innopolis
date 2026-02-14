-- Migration: 003_grade_and_ege
-- Description: Add grade level and EGE preparation support
-- ============================================

-- Add grade column to courses (7, 8, 9, 10, 11)
ALTER TABLE courses ADD COLUMN grade INTEGER;

-- Add EGE-related columns to lessons
ALTER TABLE lessons ADD COLUMN ege_topic VARCHAR(100);
ALTER TABLE lessons ADD COLUMN ege_task_number INTEGER;

-- Add EGE-related columns to assignments
ALTER TABLE assignments ADD COLUMN ege_task_number INTEGER;
ALTER TABLE assignments ADD COLUMN ege_year INTEGER;

-- Update existing courses with grade 7
UPDATE courses SET grade = 7 WHERE slug LIKE '%-7-%';

-- Add index for grade filtering
CREATE INDEX idx_courses_grade ON courses(grade);
CREATE INDEX idx_lessons_ege_topic ON lessons(ege_topic) WHERE ege_topic IS NOT NULL;

-- Add comments
COMMENT ON COLUMN courses.grade IS 'School grade level (7-11)';
COMMENT ON COLUMN lessons.ege_topic IS 'EGE topic reference (e.g. "Информация и информационные процессы")';
COMMENT ON COLUMN lessons.ege_task_number IS 'EGE task number (1-27) this lesson prepares for';
COMMENT ON COLUMN assignments.ege_task_number IS 'EGE task number this assignment corresponds to';
COMMENT ON COLUMN assignments.ege_year IS 'EGE exam year for reference tasks';

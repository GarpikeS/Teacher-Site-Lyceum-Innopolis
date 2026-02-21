-- Migration: 005_homework
-- Description: Add homework system for teachers to assign work to classes
-- ============================================

-- Allow standalone assignments (not tied to a lesson) for homework
ALTER TABLE assignments ALTER COLUMN lesson_id DROP NOT NULL;

-- Create homework table
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deadline TIMESTAMP,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_homework_class ON homework(class_id);
CREATE INDEX idx_homework_assignment ON homework(assignment_id);
CREATE INDEX idx_homework_assigned_by ON homework(assigned_by);
CREATE INDEX idx_homework_deadline ON homework(deadline);
CREATE INDEX idx_homework_published ON homework(is_published) WHERE is_published = true;

COMMENT ON TABLE homework IS 'Homework assignments created by teachers for classes';
COMMENT ON COLUMN homework.assignment_id IS 'The coding assignment students need to complete';
COMMENT ON COLUMN homework.deadline IS 'Optional deadline for submission';

-- Migration: 004_assignment_unique_constraint
-- Description: Add unique constraint for idempotent seed inserts
-- ============================================

-- Add unique constraint on lesson_id + order_index for assignments
-- This prevents duplicate assignments when re-running seed
CREATE UNIQUE INDEX IF NOT EXISTS idx_assignments_lesson_order_unique
  ON assignments(lesson_id, order_index);

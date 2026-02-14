-- Migration: 002_functions_triggers
-- Description: Database functions, triggers, and views
-- ============================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate course progress percentage
CREATE OR REPLACE FUNCTION calculate_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE course_id = p_course_id AND is_published = true;

  SELECT COUNT(*) INTO completed_lessons
  FROM user_progress up
  JOIN lessons l ON l.id = up.lesson_id
  WHERE up.user_id = p_user_id
    AND l.course_id = p_course_id
    AND up.status = 'completed';

  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;

  RETURN (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
END;
$$ LANGUAGE plpgsql;

-- Function: Update course enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
  v_progress DECIMAL;
BEGIN
  SELECT course_id INTO v_course_id
  FROM lessons
  WHERE id = NEW.lesson_id;

  v_progress := calculate_course_progress(NEW.user_id, v_course_id);

  UPDATE course_enrollments
  SET progress_percentage = v_progress,
      last_accessed_at = NOW(),
      completed_at = CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END
  WHERE user_id = NEW.user_id AND course_id = v_course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollment_on_progress_change
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_enrollment_progress();

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW student_dashboard_stats AS
SELECT
  u.id AS user_id,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT ce.course_id) AS enrolled_courses,
  COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.lesson_id END) AS completed_lessons,
  COUNT(DISTINCT CASE WHEN s.status = 'passed' THEN s.assignment_id END) AS passed_assignments,
  COUNT(DISTINCT ua.achievement_id) AS earned_achievements,
  COALESCE(SUM(a.points), 0) AS total_points
FROM users u
LEFT JOIN course_enrollments ce ON ce.user_id = u.id
LEFT JOIN user_progress up ON up.user_id = u.id
LEFT JOIN submissions s ON s.user_id = u.id
LEFT JOIN user_achievements ua ON ua.user_id = u.id
LEFT JOIN achievements a ON a.id = ua.achievement_id
WHERE u.role = 'student'
GROUP BY u.id, u.first_name, u.last_name;

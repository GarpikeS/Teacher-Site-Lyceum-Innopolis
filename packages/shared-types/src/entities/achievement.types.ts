export interface AchievementCriteria {
  type: 'lessons_completed' | 'assignments_completed' | 'perfect_score' | 'course_completed' | 'streak_days';
  count?: number;
  courseId?: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description?: string;
  iconUrl?: string;
  badgeColor?: string;
  criteria: AchievementCriteria;
  points: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
}

export interface AchievementWithStatus extends Achievement {
  isEarned: boolean;
  earnedAt?: Date;
  progress?: number;
  progressTarget?: number;
}

export interface CreateAchievementDto {
  slug: string;
  title: string;
  description?: string;
  iconUrl?: string;
  badgeColor?: string;
  criteria: AchievementCriteria;
  points?: number;
}

export interface UpdateAchievementDto {
  title?: string;
  description?: string;
  iconUrl?: string;
  badgeColor?: string;
  criteria?: AchievementCriteria;
  points?: number;
  isActive?: boolean;
}

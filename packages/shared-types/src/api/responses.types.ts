// ============================================
// COMMON RESPONSES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

// ============================================
// AUTH RESPONSES
// ============================================

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ============================================
// STATISTICS RESPONSES
// ============================================

export interface DashboardStats {
  enrolledCourses: number;
  completedLessons: number;
  passedAssignments: number;
  earnedAchievements: number;
  totalPoints: number;
  currentStreak: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: Date;
  }>;
}

export interface CourseProgressResponse {
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lessonsProgress: Array<{
    lessonId: string;
    lessonTitle: string;
    status: string;
    completedAt?: Date;
  }>;
}

export interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  pendingReviews: number;
  averageClassProgress: number;
  recentSubmissions: Array<{
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: Date;
  }>;
}

// ============================================
// HEALTH CHECK
// ============================================

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    codeExecutor: 'up' | 'down';
  };
  version: string;
}

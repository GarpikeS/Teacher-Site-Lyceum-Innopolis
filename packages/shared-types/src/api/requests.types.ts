// ============================================
// PAGINATION
// ============================================

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// FILTERS
// ============================================

export interface CourseFilters extends PaginationQuery {
  language?: 'python' | 'cpp';
  level?: string;
  isPublished?: boolean;
}

export interface LessonFilters extends PaginationQuery {
  courseId?: string;
  isPublished?: boolean;
}

export interface AssignmentFilters extends PaginationQuery {
  lessonId?: string;
  assignmentType?: string;
  difficulty?: string;
}

export interface SubmissionFilters extends PaginationQuery {
  assignmentId?: string;
  userId?: string;
  status?: string;
}

export interface NotificationFilters extends PaginationQuery {
  isRead?: boolean;
  notificationType?: string;
}

// ============================================
// SEARCH
// ============================================

export interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  limit?: number;
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  query: string;
}

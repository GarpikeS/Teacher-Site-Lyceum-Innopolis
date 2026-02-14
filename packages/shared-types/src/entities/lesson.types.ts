import { LessonStatus } from '../enums';

export interface Lesson {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  orderIndex: number;
  durationMinutes?: number;
  isPublished: boolean;
  prerequisites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonWithProgress extends Lesson {
  status: LessonStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpentSeconds: number;
  lastAccessedAt?: Date;
}

export interface CreateLessonDto {
  courseId: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  orderIndex: number;
  durationMinutes?: number;
  prerequisites?: string[];
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
  content?: string;
  orderIndex?: number;
  durationMinutes?: number;
  isPublished?: boolean;
  prerequisites?: string[];
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: LessonStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpentSeconds: number;
  lastAccessedAt: Date;
}

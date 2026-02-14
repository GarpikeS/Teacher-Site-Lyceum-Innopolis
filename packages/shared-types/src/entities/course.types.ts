import { ProgrammingLanguage, CourseLevel } from '../enums';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description?: string;
  language: ProgrammingLanguage;
  level: CourseLevel;
  iconUrl?: string;
  coverImageUrl?: string;
  isPublished: boolean;
  orderIndex: number;
  estimatedHours?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithProgress extends Course {
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt?: Date;
  lastAccessedAt?: Date;
}

export interface CreateCourseDto {
  slug: string;
  title: string;
  description?: string;
  language: ProgrammingLanguage;
  level?: CourseLevel;
  iconUrl?: string;
  coverImageUrl?: string;
  orderIndex: number;
  estimatedHours?: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  iconUrl?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
  orderIndex?: number;
  estimatedHours?: number;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progressPercentage: number;
  lastAccessedAt?: Date;
  completedAt?: Date;
}

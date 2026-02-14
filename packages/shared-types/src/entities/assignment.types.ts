import { AssignmentType, DifficultyLevel, ValidationType } from '../enums';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  description: string;
  isHidden: boolean;
  points: number;
}

export interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  assignmentType: AssignmentType;
  difficulty?: DifficultyLevel;
  starterCode?: string;
  testCases?: TestCase[];
  validationType: ValidationType;
  maxAttempts: number;
  timeLimitSeconds?: number;
  memoryLimitMb?: number;
  points: number;
  orderIndex: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentDto {
  lessonId: string;
  title: string;
  description: string;
  assignmentType?: AssignmentType;
  difficulty?: DifficultyLevel;
  starterCode?: string;
  testCases?: TestCase[];
  validationType?: ValidationType;
  maxAttempts?: number;
  timeLimitSeconds?: number;
  memoryLimitMb?: number;
  points?: number;
  orderIndex: number;
}

export interface UpdateAssignmentDto {
  title?: string;
  description?: string;
  starterCode?: string;
  testCases?: TestCase[];
  validationType?: ValidationType;
  maxAttempts?: number;
  timeLimitSeconds?: number;
  memoryLimitMb?: number;
  points?: number;
  orderIndex?: number;
  isPublished?: boolean;
}

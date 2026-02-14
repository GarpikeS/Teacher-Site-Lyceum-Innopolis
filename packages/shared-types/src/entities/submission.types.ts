import { SubmissionStatus, ProgrammingLanguage } from '../enums';

export interface TestResult {
  testId: number;
  passed: boolean;
  actualOutput: string;
  expectedOutput?: string;
  executionTime: number;
  error?: string;
}

export interface TestResults {
  passedTests: number;
  totalTests: number;
  details: TestResult[];
  error?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  code: string;
  language: ProgrammingLanguage;
  status: SubmissionStatus;
  testResults?: TestResults;
  executionTimeMs?: number;
  memoryUsedMb?: number;
  score: number;
  maxScore?: number;
  teacherFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  attemptNumber: number;
  submittedAt: Date;
  gradedAt?: Date;
}

export interface CreateSubmissionDto {
  assignmentId: string;
  code: string;
  language: ProgrammingLanguage;
}

export interface ExecuteCodeDto {
  code: string;
  language: ProgrammingLanguage;
  input?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

export interface ReviewSubmissionDto {
  score?: number;
  teacherFeedback: string;
}

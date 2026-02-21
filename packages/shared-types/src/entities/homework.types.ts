export interface Homework {
  id: string;
  title: string;
  description?: string;
  classId: string;
  assignmentId: string;
  assignedBy: string;
  deadline?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeworkWithDetails extends Homework {
  className: string;
  assignmentTitle: string;
  assignmentDescription: string;
  assignmentDifficulty: string;
  assignmentStarterCode?: string;
  assignmentTestCases?: any;
  assignmentPoints: number;
  teacherFirstName: string;
  teacherLastName: string;
  submissionsCount?: number;
  studentsCount?: number;
}

export interface HomeworkForStudent extends HomeworkWithDetails {
  submissionStatus?: string;
  submissionScore?: number;
  submittedAt?: Date;
}

export interface CreateHomeworkDto {
  title: string;
  description?: string;
  classId: string;
  deadline?: string;
  // Assignment fields (creates a standalone assignment)
  assignmentTitle: string;
  assignmentDescription: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode?: string;
  testCases: Array<{ input: string; expectedOutput: string; description: string }>;
  points: number;
  language: 'python' | 'cpp';
}

export interface UpdateHomeworkDto {
  title?: string;
  description?: string;
  deadline?: string;
  isPublished?: boolean;
}

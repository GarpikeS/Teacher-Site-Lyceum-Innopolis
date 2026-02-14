export interface Class {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  academicYear?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  joinedAt: Date;
}

export interface ClassWithStudents extends Class {
  studentsCount: number;
  students?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    joinedAt: Date;
  }>;
}

export interface CreateClassDto {
  name: string;
  description?: string;
  academicYear?: string;
}

export interface UpdateClassDto {
  name?: string;
  description?: string;
  academicYear?: string;
  isActive?: boolean;
}

export interface AddStudentDto {
  studentId: string;
}

export interface ClassStatistics {
  classId: string;
  className: string;
  studentsCount: number;
  averageProgress: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  topStudents: Array<{
    id: string;
    firstName: string;
    lastName: string;
    progress: number;
    score: number;
  }>;
}

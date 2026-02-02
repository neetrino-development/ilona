import type { User, UserStatus } from '@/types';

export interface Teacher {
  id: string;
  userId: string;
  bio?: string;
  specialization?: string;
  hourlyRate: number;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'phone' | 'avatarUrl' | 'status' | 'lastLoginAt' | 'createdAt'>;
  groups?: TeacherGroup[];
  _count: {
    groups: number;
    lessons: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeacherGroup {
  id: string;
  name: string;
  level?: string;
}

export interface TeachersResponse {
  items: Teacher[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TeacherFilters {
  skip?: number;
  take?: number;
  search?: string;
  status?: UserStatus;
}

export interface CreateTeacherDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  hourlyRate: number;
  workingDays?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: UserStatus;
  bio?: string;
  specialization?: string;
  hourlyRate?: number;
  workingDays?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface TeacherStatistics {
  lessons: {
    total: number;
    completed: number;
    cancelled: number;
    scheduled: number;
  };
  compliance: {
    vocabularyRate: number;
    feedbackRate: number;
  };
  deductions: {
    count: number;
    total: number;
  };
  studentsCount: number;
  groupsCount: number;
}

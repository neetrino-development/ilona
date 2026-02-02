import { api } from '@/shared/lib/api';

export interface SalaryRecord {
  id: string;
  teacherId: string;
  month: string;
  baseSalary: number;
  lessonsCount: number;
  bonuses: number;
  deductions: number;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalariesResponse {
  items: SalaryRecord[];
  total: number;
}

export interface TeacherSalarySummary {
  totalEarned: number;
  totalPending: number;
  totalDeductions: number;
  lessonsCount: number;
  averagePerLesson: number;
}

export interface Deduction {
  id: string;
  teacherId: string;
  amount: number;
  reason: 'LATE' | 'ABSENCE' | 'VOCAB_NOT_SENT' | 'OTHER';
  description?: string;
  lessonId?: string;
  createdAt: string;
}

export interface DeductionsResponse {
  items: Deduction[];
  total: number;
}

const FINANCE_ENDPOINT = '/finance';

/**
 * Fetch teacher's salary records
 */
export async function fetchMySalaries(
  skip?: number,
  take?: number
): Promise<SalariesResponse> {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append('skip', String(skip));
  if (take !== undefined) params.append('take', String(take));

  const query = params.toString();
  const url = query ? `${FINANCE_ENDPOINT}/my-salary?${query}` : `${FINANCE_ENDPOINT}/my-salary`;

  return api.get<SalariesResponse>(url);
}

/**
 * Fetch teacher's salary summary
 */
export async function fetchMySalarySummary(): Promise<TeacherSalarySummary> {
  return api.get<TeacherSalarySummary>(`${FINANCE_ENDPOINT}/my-salary/summary`);
}

/**
 * Fetch teacher's deductions
 */
export async function fetchMyDeductions(
  skip?: number,
  take?: number
): Promise<DeductionsResponse> {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append('skip', String(skip));
  if (take !== undefined) params.append('take', String(take));

  const query = params.toString();
  const url = query ? `${FINANCE_ENDPOINT}/my-deductions?${query}` : `${FINANCE_ENDPOINT}/my-deductions`;

  return api.get<DeductionsResponse>(url);
}

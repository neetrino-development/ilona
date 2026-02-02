import { api } from '@/shared/lib/api';

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidAt?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentsResponse {
  items: Payment[];
  total: number;
}

export interface StudentPaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  nextPayment: {
    id: string;
    amount: number;
    dueDate: string;
  } | null;
}

const FINANCE_ENDPOINT = '/finance';

/**
 * Fetch student's payment records
 */
export async function fetchMyPayments(
  skip?: number,
  take?: number,
  status?: string
): Promise<PaymentsResponse> {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append('skip', String(skip));
  if (take !== undefined) params.append('take', String(take));
  if (status) params.append('status', status);

  const query = params.toString();
  const url = query ? `${FINANCE_ENDPOINT}/my-payments?${query}` : `${FINANCE_ENDPOINT}/my-payments`;

  return api.get<PaymentsResponse>(url);
}

/**
 * Fetch student's payment summary
 */
export async function fetchMyPaymentsSummary(): Promise<StudentPaymentSummary> {
  return api.get<StudentPaymentSummary>(`${FINANCE_ENDPOINT}/my-payments/summary`);
}

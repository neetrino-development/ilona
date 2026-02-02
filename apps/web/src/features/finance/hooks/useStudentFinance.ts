'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchMyPayments,
  fetchMyPaymentsSummary,
} from '../api/student-finance.api';

export const studentFinanceKeys = {
  all: ['student-finance'] as const,
  payments: () => [...studentFinanceKeys.all, 'payments'] as const,
  paymentList: (skip?: number, take?: number, status?: string) => [...studentFinanceKeys.payments(), { skip, take, status }] as const,
  paymentSummary: () => [...studentFinanceKeys.all, 'payment-summary'] as const,
};

/**
 * Hook to fetch student's payment records
 */
export function useMyPayments(skip?: number, take?: number, status?: string) {
  return useQuery({
    queryKey: studentFinanceKeys.paymentList(skip, take, status),
    queryFn: () => fetchMyPayments(skip, take, status),
  });
}

/**
 * Hook to fetch student's payment summary
 */
export function useMyPaymentsSummary() {
  return useQuery({
    queryKey: studentFinanceKeys.paymentSummary(),
    queryFn: () => fetchMyPaymentsSummary(),
  });
}

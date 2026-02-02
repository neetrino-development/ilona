'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFinanceDashboard, fetchAdminDashboardStats } from '../api/dashboard.api';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  admin: () => [...dashboardKeys.all, 'admin'] as const,
  finance: (dateFrom?: string, dateTo?: string) =>
    [...dashboardKeys.all, 'finance', { dateFrom, dateTo }] as const,
};

/**
 * Hook to fetch admin dashboard stats
 */
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: fetchAdminDashboardStats,
    staleTime: 30 * 1000, // 30 seconds - dashboard data should be relatively fresh
  });
}

/**
 * Hook to fetch finance dashboard
 */
export function useFinanceDashboard(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: dashboardKeys.finance(dateFrom, dateTo),
    queryFn: () => fetchFinanceDashboard(dateFrom, dateTo),
  });
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserRole } from '@ilona/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  locale: string;
}

export function DashboardLayout({ children, role, locale }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    // Check if user has the correct role
    if (user && user.role !== role) {
      router.push(`/${locale}/${user.role.toLowerCase()}/dashboard`);
    }
  }, [isAuthenticated, user, role, locale, router]);

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || (user && user.role !== role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} locale={locale} />
      <Header locale={locale} />
      <main className="ml-64 mt-16 p-6">{children}</main>
    </div>
  );
}


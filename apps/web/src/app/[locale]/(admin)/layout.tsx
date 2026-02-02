'use client';

import { DashboardLayout } from '@/shared/components/layout';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AdminLayout({ children, params: { locale } }: AdminLayoutProps) {
  return (
    <DashboardLayout role="ADMIN" locale={locale}>
      {children}
    </DashboardLayout>
  );
}


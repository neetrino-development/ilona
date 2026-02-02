'use client';

import { DashboardLayout } from '@/shared/components/layout';

interface StudentLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function StudentLayout({ children, params: { locale } }: StudentLayoutProps) {
  return (
    <DashboardLayout role="STUDENT" locale={locale}>
      {children}
    </DashboardLayout>
  );
}


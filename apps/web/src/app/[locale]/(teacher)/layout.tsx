'use client';

import { DashboardLayout } from '@/shared/components/layout';

interface TeacherLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function TeacherLayout({ children, params: { locale } }: TeacherLayoutProps) {
  return (
    <DashboardLayout role="TEACHER" locale={locale}>
      {children}
    </DashboardLayout>
  );
}


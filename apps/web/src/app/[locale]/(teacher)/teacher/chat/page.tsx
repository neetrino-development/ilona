'use client';

import { useTranslations } from 'next-intl';
import { ChatContainer } from '@/features/chat';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';

export default function TeacherChatPage() {
  const t = useTranslations('nav');

  return (
    <DashboardLayout title={t('chat')}>
      <ChatContainer
        emptyTitle="Select a group"
        emptyDescription="Choose a group chat to communicate with students"
      />
    </DashboardLayout>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { ChatContainer } from '@/features/chat';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';

export default function StudentChatPage() {
  const t = useTranslations('nav');

  return (
    <DashboardLayout title={t('chat')}>
      <ChatContainer
        emptyTitle="Select a chat"
        emptyDescription="Choose a conversation to view messages and vocabulary"
      />
    </DashboardLayout>
  );
}

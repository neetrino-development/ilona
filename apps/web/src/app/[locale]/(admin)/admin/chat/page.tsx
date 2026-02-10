'use client';

import { useTranslations } from 'next-intl';
import { AdminChatContainer } from '@/features/chat';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';

export default function AdminChatPage() {
  const t = useTranslations('nav');

  return (
    <DashboardLayout title={t('chat')}>
      <AdminChatContainer
        emptyTitle="Select a chat"
        emptyDescription="Choose a conversation from the list to start messaging"
      />
    </DashboardLayout>
  );
}

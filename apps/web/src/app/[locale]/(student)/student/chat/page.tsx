'use client';

import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ChatContainer } from '@/features/chat';

export default function StudentChatPage() {
  return (
    <DashboardLayout title="Group Chat" subtitle="Stay connected with your teacher and classmates.">
      <ChatContainer
        emptyTitle="Select a chat"
        emptyDescription="Choose a conversation to view messages and vocabulary"
      />
    </DashboardLayout>
  );
}

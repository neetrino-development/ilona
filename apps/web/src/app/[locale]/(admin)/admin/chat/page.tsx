'use client';

import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ChatContainer } from '@/features/chat';

export default function AdminChatPage() {
  return (
    <DashboardLayout title="Chat" subtitle="Communicate with teachers and students.">
      <ChatContainer
        emptyTitle="Select a chat"
        emptyDescription="Choose a conversation from the list to start messaging"
      />
    </DashboardLayout>
  );
}

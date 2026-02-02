'use client';

import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ChatContainer } from '@/features/chat';

export default function TeacherChatPage() {
  return (
    <DashboardLayout title="Group Chat" subtitle="Communicate with your students and share vocabulary.">
      <ChatContainer
        emptyTitle="Select a group"
        emptyDescription="Choose a group chat to communicate with students"
      />
    </DashboardLayout>
  );
}

'use client';

import { ChatContainer } from '@/features/chat';

export default function TeacherChatPage() {
  return (
    <div className="h-screen w-screen bg-slate-50">
      <ChatContainer
        emptyTitle="Select a group"
        emptyDescription="Choose a group chat to communicate with students"
        className="h-full rounded-none border-0"
      />
    </div>
  );
}

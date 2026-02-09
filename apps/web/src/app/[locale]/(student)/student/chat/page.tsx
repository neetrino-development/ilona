'use client';

import { ChatContainer } from '@/features/chat';

export default function StudentChatPage() {
  return (
    <div className="h-screen w-screen bg-slate-50">
      <ChatContainer
        emptyTitle="Select a chat"
        emptyDescription="Choose a conversation to view messages and vocabulary"
        className="h-full rounded-none border-0"
      />
    </div>
  );
}

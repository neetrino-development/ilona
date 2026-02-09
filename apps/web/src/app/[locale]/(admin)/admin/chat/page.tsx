'use client';

import { AdminChatContainer } from '@/features/chat';

export default function AdminChatPage() {
  return (
    <div className="h-screen w-screen bg-slate-50">
      <AdminChatContainer
        emptyTitle="Select a chat"
        emptyDescription="Choose a conversation from the list to start messaging"
        className="h-full rounded-none border-0"
      />
    </div>
  );
}

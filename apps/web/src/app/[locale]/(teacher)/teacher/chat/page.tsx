'use client';

import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ChatList, ChatWindow, useChatStore, useSocket, type Chat } from '@/features/chat';
import { cn } from '@/shared/lib/utils';

export default function TeacherChatPage() {
  const { activeChat, setActiveChat, isMobileListVisible, setMobileListVisible } = useChatStore();

  // Initialize socket connection
  useSocket();

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setMobileListVisible(false);
  };

  const handleBack = () => {
    setMobileListVisible(true);
    setActiveChat(null);
  };

  return (
    <DashboardLayout title="Group Chat" subtitle="Communicate with your students and share vocabulary.">
      <div className="h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex h-full">
          {/* Chat List */}
          <div
            className={cn(
              'w-full lg:w-80 border-r border-slate-200 flex-shrink-0',
              !isMobileListVisible && 'hidden lg:block'
            )}
          >
            <ChatList onSelectChat={handleSelectChat} />
          </div>

          {/* Chat Window */}
          <div
            className={cn(
              'flex-1 flex flex-col',
              isMobileListVisible && !activeChat && 'hidden lg:flex'
            )}
          >
            {activeChat ? (
              <ChatWindow chat={activeChat} onBack={handleBack} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    Select a group
                  </h3>
                  <p className="text-sm text-slate-500">
                    Choose a group chat to communicate with students
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

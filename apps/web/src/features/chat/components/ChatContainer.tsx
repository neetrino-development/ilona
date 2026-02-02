'use client';

import { useState, useEffect } from 'react';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { useChatStore } from '../store/chat.store';
import { useSocket } from '../hooks';
import type { Chat } from '../types';
import { cn } from '@/shared/lib/utils';

interface ChatContainerProps {
  emptyTitle?: string;
  emptyDescription?: string;
}

function ChatContent({ emptyTitle, emptyDescription }: ChatContainerProps) {
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
                  {emptyTitle || 'Select a chat'}
                </h3>
                <p className="text-sm text-slate-500">
                  {emptyDescription || 'Choose a conversation from the list to start messaging'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChatContainer(props: ChatContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return <ChatContent {...props} />;
}

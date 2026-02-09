'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { useChatStore } from '../store/chat.store';
import { useSocket, useChats } from '../hooks';
import type { Chat } from '../types';
import { cn } from '@/shared/lib/utils';

interface ChatContainerProps {
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

function ChatContent({ emptyTitle, emptyDescription, className }: ChatContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeChat, setActiveChat, isMobileListVisible, setMobileListVisible } = useChatStore();
  const { data: chats = [], isLoading: isLoadingChats } = useChats();
  const isInitialMount = useRef(true);

  // Initialize socket connection
  useSocket();

  // Restore chat from URL on initial mount when chats are loaded
  useEffect(() => {
    if (isLoadingChats || !isInitialMount.current) return;
    
    const chatIdFromUrl = searchParams.get('chatId');
    
    if (chatIdFromUrl && chats.length > 0) {
      const chatFromList = chats.find((chat) => chat.id === chatIdFromUrl);
      if (chatFromList) {
        setActiveChat(chatFromList);
        setMobileListVisible(false);
      } else {
        // Chat not found in list, remove from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete('chatId');
        router.replace(`${pathname}?${params.toString()}`);
      }
      isInitialMount.current = false;
    } else if (!chatIdFromUrl) {
      isInitialMount.current = false;
    }
  }, [chats, isLoadingChats, searchParams, setActiveChat, setMobileListVisible, router, pathname]);

  // Sync URL when activeChat changes (but skip on initial mount)
  useEffect(() => {
    if (isInitialMount.current) return;
    
    const chatIdFromUrl = searchParams.get('chatId');
    if (activeChat) {
      if (activeChat.id !== chatIdFromUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('chatId', activeChat.id);
        router.replace(`${pathname}?${params.toString()}`);
      }
    } else if (chatIdFromUrl) {
      // activeChat is null but URL has chatId - remove it
      const params = new URLSearchParams(searchParams.toString());
      params.delete('chatId');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [activeChat, searchParams, router, pathname]);

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setMobileListVisible(false);
    // Update URL immediately
    const params = new URLSearchParams(searchParams.toString());
    params.set('chatId', chat.id);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleBack = () => {
    setMobileListVisible(true);
    setActiveChat(null);
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('chatId');
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden", className)}>
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
      <div className={cn("h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden", props.className)}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return <ChatContent {...props} />;
}

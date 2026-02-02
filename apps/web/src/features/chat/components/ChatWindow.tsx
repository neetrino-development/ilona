'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useMessages, useSocket } from '../hooks';
import { useChatStore } from '../store/chat.store';
import type { Chat, Message } from '../types';
import { cn } from '@/shared/lib/utils';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage?: (content: string, type?: string) => void;
  onBack?: () => void;
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { getDraft, setDraft, clearDraft, getTypingUsers, addTypingUser } = useChatStore();
  const [inputValue, setInputValue] = useState(getDraft(chat.id));

  // Fetch messages
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(chat.id);

  // Socket
  const {
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    isUserOnline,
  } = useSocket({
    onTypingStart: ({ chatId, userId }) => {
      if (chatId === chat.id && userId !== user?.id) {
        addTypingUser(chatId, userId);
      }
    },
  });

  // Flatten messages from infinite query
  const messages = messagesData?.pages.flatMap((page) => page.items) || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Mark as read when opening chat
  useEffect(() => {
    if (chat.id && isConnected) {
      markAsRead(chat.id);
    }
  }, [chat.id, isConnected, markAsRead]);

  // Save draft on unmount
  useEffect(() => {
    return () => {
      if (inputValue.trim()) {
        setDraft(chat.id, inputValue);
      }
    };
  }, [chat.id, inputValue, setDraft]);

  // Get chat title
  const getChatTitle = () => {
    if (chat.type === 'GROUP') {
      return chat.name || chat.group?.name || 'Group Chat';
    }
    const other = chat.participants.find((p) => p.userId !== user?.id);
    return other ? `${other.user.firstName} ${other.user.lastName}` : 'Chat';
  };

  // Get online status for direct chats
  const getOnlineStatus = () => {
    if (chat.type === 'GROUP') return null;
    const other = chat.participants.find((p) => p.userId !== user?.id);
    if (!other) return null;
    return isUserOnline(chat.id, other.userId);
  };

  // Get typing users names
  const typingUserIds = getTypingUsers(chat.id);
  const typingNames = typingUserIds
    .map((id) => {
      const participant = chat.participants.find((p) => p.userId === id);
      return participant?.user.firstName;
    })
    .filter(Boolean);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Typing indicator
    if (isConnected) {
      startTyping(chat.id);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(chat.id);
      }, 2000);
    }
  };

  // Handle send
  const handleSend = useCallback(async () => {
    const content = inputValue.trim();
    if (!content || !isConnected) return;

    setInputValue('');
    clearDraft(chat.id);
    stopTyping(chat.id);

    const result = await sendMessage(chat.id, content);
    if (!result.success) {
      console.error('Failed to send message:', result.error);
      setInputValue(content); // Restore on failure
    }
  }, [inputValue, chat.id, isConnected, sendMessage, clearDraft, stopTyping]);

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date separator
  const formatDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if should show date separator
  const shouldShowDateSeparator = (message: Message, prevMessage?: Message) => {
    if (!prevMessage) return true;
    const currDate = new Date(message.createdAt).toDateString();
    const prevDate = new Date(prevMessage.createdAt).toDateString();
    return currDate !== prevDate;
  };

  const onlineStatus = getOnlineStatus();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3">
        {/* Back button (mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Avatar */}
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold',
            chat.type === 'GROUP'
              ? 'bg-gradient-to-br from-purple-500 to-purple-600'
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          )}
        >
          {getChatTitle()[0]}
        </div>

        {/* Title */}
        <div className="flex-1">
          <h2 className="font-semibold text-slate-800">{getChatTitle()}</h2>
          {typingNames.length > 0 ? (
            <p className="text-xs text-blue-600">
              {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
            </p>
          ) : onlineStatus !== null ? (
            <p className={cn('text-xs', onlineStatus ? 'text-green-600' : 'text-slate-500')}>
              {onlineStatus ? 'Online' : 'Offline'}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              {chat.participants.length} participants
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500'
            )}
            title={isConnected ? 'Connected' : 'Reconnecting...'}
          />
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {/* Load more button */}
        {hasNextPage && (
          <div className="text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No messages yet</p>
            <p className="text-sm text-slate-400 mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.senderId === user?.id;
            const prevMessage = messages[index - 1];
            const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
            const isDeleted = message.content === null && message.isSystem;

            return (
              <div key={message.id}>
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 bg-white rounded-full text-xs text-slate-500 shadow-sm">
                      {formatDateSeparator(message.createdAt)}
                    </span>
                  </div>
                )}

                {/* Message */}
                <div
                  className={cn(
                    'flex gap-2',
                    isOwn ? 'justify-end' : 'justify-start'
                  )}
                >
                  {/* Avatar (only for others) */}
                  {!isOwn && (
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-sm font-medium flex-shrink-0">
                      {message.sender?.firstName?.[0] || '?'}
                    </div>
                  )}

                  <div className={cn('max-w-[70%]', isOwn && 'order-first')}>
                    {/* Sender name (group chats) */}
                    {!isOwn && chat.type === 'GROUP' && (
                      <p className="text-xs text-slate-500 mb-1 ml-1">
                        {message.sender?.firstName} {message.sender?.lastName}
                      </p>
                    )}

                    {/* Message bubble */}
                    <div
                      className={cn(
                        'px-4 py-2 rounded-2xl',
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-slate-800 rounded-bl-md shadow-sm',
                        isDeleted && 'opacity-60 italic'
                      )}
                    >
                      {isDeleted ? (
                        <p className="text-sm">This message was deleted</p>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}
                    </div>

                    {/* Time & edited indicator */}
                    <div
                      className={cn(
                        'flex items-center gap-1 mt-1',
                        isOwn ? 'justify-end mr-1' : 'justify-start ml-1'
                      )}
                    >
                      <span className="text-xs text-slate-400">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.isEdited && (
                        <span className="text-xs text-slate-400">(edited)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <button className="p-2 hover:bg-slate-100 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2 bg-slate-100 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-h-32"
            style={{ minHeight: '40px' }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isConnected}
            className={cn(
              'p-2 rounded-lg flex-shrink-0 transition-colors',
              inputValue.trim() && isConnected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-100 text-slate-400'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

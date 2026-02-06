'use client';

import { useState, useEffect } from 'react';
import { ChatContainer } from './ChatContainer';
import { cn } from '@/shared/lib/utils';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed z-40',
          'bottom-4 right-4 sm:bottom-6 sm:right-6',
          'w-14 h-14 sm:w-16 sm:h-16',
          'rounded-full',
          'bg-gradient-to-br from-blue-500 to-indigo-600',
          'text-white shadow-lg shadow-blue-500/30',
          'flex items-center justify-center',
          'hover:shadow-xl hover:shadow-blue-500/40',
          'transition-all duration-200',
          'hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'md:hover:scale-105'
        )}
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7"
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
      </button>

      {/* Chat Drawer Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[60] transition-opacity animate-in fade-in-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={cn(
              'fixed right-0 top-0 bottom-0 z-[70]',
              'w-full sm:w-[480px] lg:w-[600px]',
              'bg-white shadow-2xl',
              'flex flex-col',
              'transform transition-transform duration-300 ease-out',
              'animate-in slide-in-from-right'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Chat panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0">
              <h2 className="text-lg font-semibold text-white">Chat</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  'p-2 rounded-lg',
                  'text-white/80 hover:text-white hover:bg-white/20',
                  'transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-white/50'
                )}
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden p-4 sm:p-6 min-h-0">
              <ChatContainer
                emptyTitle="Select a chat"
                emptyDescription="Choose a conversation from the list to start messaging"
                className="h-full rounded-xl"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}


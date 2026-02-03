'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchChats,
  fetchChat,
  fetchMessages,
  createDirectChat,
} from '../api/chat.api';

// Query keys
export const chatKeys = {
  all: ['chats'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: () => [...chatKeys.lists()] as const,
  details: () => [...chatKeys.all, 'detail'] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
  messages: (chatId: string) => [...chatKeys.all, 'messages', chatId] as const,
};

/**
 * Hook to fetch all chats
 */
export function useChats() {
  return useQuery({
    queryKey: chatKeys.list(),
    queryFn: () => fetchChats(),
  });
}

/**
 * Hook to fetch a single chat
 */
export function useChatDetail(chatId: string, enabled = true) {
  return useQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: () => fetchChat(chatId),
    enabled: enabled && !!chatId,
  });
}

/**
 * Hook to fetch messages with infinite scroll
 */
export function useMessages(chatId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(chatId),
    queryFn: ({ pageParam }) => fetchMessages(chatId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: enabled && !!chatId,
  });
}

/**
 * Hook to create a direct chat
 */
export function useCreateDirectChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) => createDirectChat(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
}

/**
 * Hook to add a new message to cache (for real-time updates)
 */
export function useAddMessageToCache() {
  const queryClient = useQueryClient();

  return (chatId: string, message: unknown) => {
    queryClient.setQueryData(
      chatKeys.messages(chatId),
      (oldData: { pages: { items: unknown[] }[] } | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                items: [...page.items, message],
              };
            }
            return page;
          }),
        };
      }
    );

    // Also update the chat list with the last message
    queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
  };
}

/**
 * Hook to update a message in cache
 */
export function useUpdateMessageInCache() {
  const queryClient = useQueryClient();

  return (chatId: string, messageId: string, updates: Partial<unknown>) => {
    queryClient.setQueryData(
      chatKeys.messages(chatId),
      (oldData: { pages: { items: { id: string }[] }[] } | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          })),
        };
      }
    );
  };
}

/**
 * Hook to remove a message from cache
 */
export function useRemoveMessageFromCache() {
  const queryClient = useQueryClient();

  return (chatId: string, messageId: string) => {
    queryClient.setQueryData(
      chatKeys.messages(chatId),
      (oldData: { pages: { items: { id: string }[] }[] } | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((msg) => msg.id !== messageId),
          })),
        };
      }
    );
  };
}

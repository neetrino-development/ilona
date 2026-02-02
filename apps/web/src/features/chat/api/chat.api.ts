import { api } from '@/shared/lib/api';
import type { Chat, Message, MessagesResponse } from '../types';

const CHAT_ENDPOINT = '/chat';

/**
 * Fetch all user's chats
 */
export async function fetchChats(): Promise<Chat[]> {
  return api.get<Chat[]>(CHAT_ENDPOINT);
}

/**
 * Fetch a single chat by ID
 */
export async function fetchChat(chatId: string): Promise<Chat> {
  return api.get<Chat>(`${CHAT_ENDPOINT}/${chatId}`);
}

/**
 * Fetch messages for a chat with pagination
 */
export async function fetchMessages(
  chatId: string,
  cursor?: string,
  take = 50
): Promise<MessagesResponse> {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  params.append('take', String(take));

  const query = params.toString();
  return api.get<MessagesResponse>(`${CHAT_ENDPOINT}/${chatId}/messages?${query}`);
}

/**
 * Create a direct chat
 */
export async function createDirectChat(participantId: string): Promise<Chat> {
  return api.post<Chat>(CHAT_ENDPOINT, {
    participantIds: [participantId],
  });
}

/**
 * Send a message via HTTP (fallback)
 */
export async function sendMessageHttp(
  chatId: string,
  content: string,
  type = 'TEXT'
): Promise<Message> {
  return api.post<Message>(`${CHAT_ENDPOINT}/${chatId}/messages`, {
    chatId,
    content,
    type,
  });
}

/**
 * Get group chat
 */
export async function fetchGroupChat(groupId: string): Promise<Chat | null> {
  try {
    return await api.get<Chat>(`${CHAT_ENDPOINT}/group/${groupId}`);
  } catch {
    return null;
  }
}

import { create } from 'zustand';
import type { Chat, Message } from '../types';

interface TypingUser {
  chatId: string;
  userId: string;
  timestamp: number;
}

interface ChatState {
  // Active chat
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;

  // Typing indicators
  typingUsers: TypingUser[];
  addTypingUser: (chatId: string, userId: string) => void;
  removeTypingUser: (chatId: string, userId: string) => void;
  getTypingUsers: (chatId: string) => string[];

  // UI state
  isMobileListVisible: boolean;
  setMobileListVisible: (visible: boolean) => void;

  // Message input drafts
  drafts: Map<string, string>;
  setDraft: (chatId: string, content: string) => void;
  getDraft: (chatId: string) => string;
  clearDraft: (chatId: string) => void;

  // Reply to message
  replyTo: Message | null;
  setReplyTo: (message: Message | null) => void;

  // Edit message
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;

  // Clear all state
  reset: () => void;
}

// Auto-remove typing indicator after 3 seconds
const TYPING_TIMEOUT = 3000;

export const useChatStore = create<ChatState>((set, get) => ({
  // Active chat
  activeChat: null,
  setActiveChat: (chat) => set({ activeChat: chat, replyTo: null, editingMessage: null }),

  // Typing indicators
  typingUsers: [],
  addTypingUser: (chatId, userId) => {
    set((state) => {
      // Remove existing entry for this user in this chat
      const filtered = state.typingUsers.filter(
        (t) => !(t.chatId === chatId && t.userId === userId)
      );
      return {
        typingUsers: [...filtered, { chatId, userId, timestamp: Date.now() }],
      };
    });

    // Auto-remove after timeout
    setTimeout(() => {
      get().removeTypingUser(chatId, userId);
    }, TYPING_TIMEOUT);
  },
  removeTypingUser: (chatId, userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (t) => !(t.chatId === chatId && t.userId === userId)
      ),
    }));
  },
  getTypingUsers: (chatId) => {
    const now = Date.now();
    return get()
      .typingUsers.filter((t) => t.chatId === chatId && now - t.timestamp < TYPING_TIMEOUT)
      .map((t) => t.userId);
  },

  // UI state
  isMobileListVisible: true,
  setMobileListVisible: (visible) => set({ isMobileListVisible: visible }),

  // Message drafts
  drafts: new Map(),
  setDraft: (chatId, content) => {
    set((state) => {
      const newDrafts = new Map(state.drafts);
      if (content) {
        newDrafts.set(chatId, content);
      } else {
        newDrafts.delete(chatId);
      }
      return { drafts: newDrafts };
    });
  },
  getDraft: (chatId) => get().drafts.get(chatId) || '',
  clearDraft: (chatId) => {
    set((state) => {
      const newDrafts = new Map(state.drafts);
      newDrafts.delete(chatId);
      return { drafts: newDrafts };
    });
  },

  // Reply
  replyTo: null,
  setReplyTo: (message) => set({ replyTo: message, editingMessage: null }),

  // Edit
  editingMessage: null,
  setEditingMessage: (message) => set({ editingMessage: message, replyTo: null }),

  // Reset
  reset: () =>
    set({
      activeChat: null,
      typingUsers: [],
      isMobileListVisible: true,
      drafts: new Map(),
      replyTo: null,
      editingMessage: null,
    }),
}));

// Selectors
export const selectActiveChat = (state: ChatState) => state.activeChat;
export const selectTypingUsers = (chatId: string) => (state: ChatState) =>
  state.getTypingUsers(chatId);

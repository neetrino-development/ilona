// Components
export { ChatList, ChatWindow } from './components';

// Hooks
export {
  useChats,
  useChatDetail,
  useMessages,
  useCreateDirectChat,
  useSocket,
  useSocketStatus,
  chatKeys,
} from './hooks';

// Store
export { useChatStore } from './store/chat.store';

// Types
export type {
  Chat,
  Message,
  ChatUser,
  ChatParticipant,
  MessageType,
  ChatType,
  MessagesResponse,
  SocketEvents,
  SendMessagePayload,
} from './types';

// Socket utilities
export {
  initSocket,
  disconnectSocket,
  isSocketConnected,
  getSocket,
} from './lib/socket';

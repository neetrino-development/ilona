import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ChatType, MessageType } from '@prisma/client';
import { CreateChatDto, SendMessageDto, UpdateMessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all chats for a user
   */
  async getUserChats(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
            leftAt: null,
          },
        },
        isActive: true,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Get unread counts
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const participant = chat.participants.find(p => p.userId === userId);
        const unreadCount = participant?.lastReadAt
          ? await this.prisma.message.count({
              where: {
                chatId: chat.id,
                createdAt: { gt: participant.lastReadAt },
                senderId: { not: userId },
              },
            })
          : chat._count.messages;

        return {
          ...chat,
          unreadCount,
          lastMessage: chat.messages[0] || null,
        };
      }),
    );

    return chatsWithUnread;
  }

  /**
   * Get chat by ID with messages
   */
  async getChatById(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            level: true,
            center: { select: { id: true, name: true } },
          },
        },
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant of this chat');
    }

    return chat;
  }

  /**
   * Get messages with pagination
   */
  async getMessages(
    chatId: string,
    userId: string,
    params?: { cursor?: string; take?: number },
  ) {
    // Verify user is participant
    await this.getChatById(chatId, userId);

    const { cursor, take = 50 } = params || {};

    const messages = await this.prisma.message.findMany({
      where: { chatId },
      take: take + 1, // Get one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    const hasMore = messages.length > take;
    const items = hasMore ? messages.slice(0, -1) : messages;

    return {
      items: items.reverse(), // Return in chronological order
      hasMore,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    };
  }

  /**
   * Create a new direct chat
   */
  async createDirectChat(dto: CreateChatDto, creatorId: string) {
    if (!dto.participantIds?.length) {
      throw new BadRequestException('At least one participant is required');
    }

    // Check if direct chat already exists between these users
    if (dto.participantIds.length === 1) {
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          type: ChatType.DIRECT,
          participants: {
            every: {
              userId: { in: [creatorId, dto.participantIds[0]] },
            },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      });

      if (existingChat) {
        return existingChat;
      }
    }

    // Create new chat
    const allParticipants = [...new Set([creatorId, ...dto.participantIds])];

    const chat = await this.prisma.chat.create({
      data: {
        type: ChatType.DIRECT,
        name: dto.name,
        participants: {
          create: allParticipants.map((userId, index) => ({
            userId,
            isAdmin: index === 0, // Creator is admin
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return chat;
  }

  /**
   * Send a message
   */
  async sendMessage(dto: SendMessageDto, senderId: string) {
    // Verify user is participant
    await this.getChatById(dto.chatId, senderId);

    const message = await this.prisma.message.create({
      data: {
        chatId: dto.chatId,
        senderId,
        type: dto.type || MessageType.TEXT,
        content: dto.content,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        duration: dto.duration,
        metadata: dto.metadata as Prisma.InputJsonValue,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    // Update chat's updatedAt
    await this.prisma.chat.update({
      where: { id: dto.chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  /**
   * Edit a message
   */
  async editMessage(messageId: string, dto: UpdateMessageDto, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    if (message.type !== MessageType.TEXT) {
      throw new BadRequestException('Only text messages can be edited');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        content: dto.content,
        isEdited: true,
        editedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  /**
   * Delete a message (soft delete - replace content)
   */
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        content: null,
        fileUrl: null,
        isSystem: true,
        metadata: { deleted: true, deletedAt: new Date() },
      },
    });
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string, userId: string) {
    await this.prisma.chatParticipant.updateMany({
      where: {
        chatId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Send vocabulary message (special feature for teachers)
   */
  async sendVocabularyMessage(chatId: string, teacherId: string, vocabularyWords: string[]) {
    // Verify teacher is participant and is admin
    const chat = await this.getChatById(chatId, teacherId);
    const participant = chat.participants.find(p => p.userId === teacherId);
    
    if (!participant?.isAdmin) {
      throw new ForbiddenException('Only chat admins can send vocabulary');
    }

    // Create vocabulary message
    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId: teacherId,
        type: MessageType.TEXT,
        content: `📚 **Vocabulary for Today:**\n\n${vocabularyWords.map((word, i) => `${i + 1}. ${word}`).join('\n')}`,
        metadata: {
          isVocabulary: true,
          words: vocabularyWords,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return message;
  }

  /**
   * Get chat for a group
   */
  async getGroupChat(groupId: string) {
    return this.prisma.chat.findUnique({
      where: { groupId },
      include: {
        participants: {
          where: { leftAt: null },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get online users in a chat
   */
  getOnlineUsers(_chatId: string, onlineUserIds: Set<string>): string[] {
    return Array.from(onlineUserIds);
  }
}


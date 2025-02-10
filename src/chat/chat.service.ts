import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const findedUserSelect = {
  id: true,
  name: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getAllRooms() {
    return this.prisma.chatRoom.findMany({
      include: {
        messages: true,
      },
    });
  }

  async getRoomById(id: string) {
    return this.prisma.chatRoom.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            user: {
              select: findedUserSelect,
            },
          },
        },
      },
    });
  }

  async createRoom(data: { name: string }) {
    return this.prisma.chatRoom.create({
      data: {
        name: data.name,
      },
    });
  }

  async getRoomMessages(roomId: string) {
    return this.prisma.message.findMany({
      where: { roomId },
      include: {
        user: {
          select: findedUserSelect,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async sendMessage(roomId: string, data: { content: string; userId: number }) {
    console.log('Sending message:', data, roomId);
    return this.prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        roomId: roomId,
      },
      include: {
        user: {
          select: findedUserSelect,
        },
      },
    });
  }

  async deleteMessage(roomId: string, messageId: string) {
    return this.prisma.message.delete({
      where: {
        id: messageId,
        roomId: roomId,
      },
    });
  }

  async getOrCreatePrivateRoom(user1Id: string, user2Id: string) {
    // Создаем уникальный ID комнаты, сортируя ID пользователей
    const roomId = [user1Id, user2Id].sort().join('_private_');

    const existingRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });

    if (existingRoom) {
      return roomId;
    }

    // Если комната не существует, создаем новую
    await this.prisma.chatRoom.create({
      data: {
        id: roomId,
        name: `Private_${roomId}`,
        isPrivate: true,
      },
    });

    return roomId;
  }
}

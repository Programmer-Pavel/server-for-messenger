import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class VideoCallService {
  constructor(
    private readonly userService: UsersService,
    private prisma: PrismaService,
  ) {}

  // Получение информации о пользователе по ID
  async getUserById(userId: string) {
    return await this.userService.findById(parseInt(userId));
  }

  // Можно добавить методы для отслеживания активных звонков
  // например, для проверки занятости пользователя

  // Активные звонки: { userId: targetUserId }
  private activeCallsMap = new Map<string, string>();

  // Регистрация активного звонка
  registerActiveCall(callerId: string, calleeId: string): void {
    this.activeCallsMap.set(callerId, calleeId);
    this.activeCallsMap.set(calleeId, callerId);
  }

  // Завершение активного звонка
  endActiveCall(userId: string): string | null {
    const targetUserId = this.activeCallsMap.get(userId);

    if (targetUserId) {
      this.activeCallsMap.delete(userId);
      this.activeCallsMap.delete(targetUserId);
      return targetUserId;
    }

    return null;
  }

  // Проверка занятости пользователя
  isUserInCall(userId: string): boolean {
    return this.activeCallsMap.has(userId);
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

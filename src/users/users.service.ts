import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Create a strongly typed `UserSelect` object with `satisfies`
const findedUserSelect = {
  id: true,
  email: true,
  password: true,
  name: true,
} satisfies Prisma.UserSelect;

// Infer the resulting payload type
type FindedUser = Prisma.UserGetPayload<{
  select: typeof findedUserSelect;
}>;

const createdUserSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

type CreatedUser = Prisma.UserGetPayload<{
  select: typeof createdUserSelect;
}>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CreatedUser[]> {
    try {
      const users = await this.prisma.user.findMany({
        select: createdUserSelect,
      });
      return users;
    } catch (error) {
      throw new Error('Ошибка при получении списка пользователей');
    }
  }

  async findOne(email: string): Promise<FindedUser | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: findedUserSelect,
      });

      if (!user) {
        throw new NotFoundException('Пользователь с таким email не найден');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Ошибка при поиске пользователя');
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<CreatedUser | null> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }

      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      const userData = { ...data, password: hashedPassword };

      return this.prisma.user.create({
        data: userData,
        select: createdUserSelect,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Ошибка при создании пользователя');
    }
  }

  // async updateUserStatus(userId: string, isOnline: boolean) {
  //   return this.prisma.user.update({
  //     where: { id: userId },
  //     data: {
  //       isOnline,
  //       lastSeen: new Date(),
  //     },
  //     select: findedUserSelect,
  //   });
  // }
}

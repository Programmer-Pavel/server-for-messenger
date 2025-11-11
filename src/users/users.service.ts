import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatedUser, createdUserFields, FindedUser, findedUserFields } from './user.types';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  async findAll(): Promise<CreatedUser[]> {
    return this.userRepo.findAll({ fields: createdUserFields });
  }

  async findByEmail(email: string): Promise<FindedUser> {
    const user = await this.userRepo.findOne({ email }, { fields: findedUserFields });
    if (!user) throw new NotFoundException('Пользователь с таким email не найден');
    return user;
  }

  async findById(id: number): Promise<FindedUser> {
    const user = await this.userRepo.findOne({ id }, { fields: findedUserFields });
    if (!user) throw new NotFoundException('Пользователь с таким id не найден');
    return user;
  }

  async createUser(data: CreateUserDto): Promise<CreatedUser> {
    const existing = await this.userRepo.findOne({ email: data.email });
    if (existing) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      isOnline: false,
      lastSeen: new Date(),
    });

    await this.userRepo.getEntityManager().persistAndFlush(user);

    return { id: user.id, email: user.email, name: user.name };
  }
}

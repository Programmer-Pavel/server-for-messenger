import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ChatModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}

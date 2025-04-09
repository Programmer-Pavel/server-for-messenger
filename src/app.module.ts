import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { VideoCallModule } from './videocall/videocall.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ChatModule, VideoCallModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

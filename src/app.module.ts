import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './logger.middleware';
import { CatsController } from './cats/cats.controller';
// import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [CatsModule, AuthModule, UsersModule, PrismaModule, ChatModule],
  // providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    // Configure CORS with allowed origins and methods
    const corsOptions = {
      origin: ['http://localhost:5173', 'https://messanger-kappa.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.enableCors(corsOptions);

    // Set up global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Enable cookie parsing
    app.use(cookieParser());

    // Configure Swagger documentation
    const swaggerConfig = new DocumentBuilder()
      .addCookieAuth('token')
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .build();

    const swaggerDocument = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument);

    // Start server on configured port
    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger documentation available at: http://localhost:${port}/api`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error starting application: ${error.message}`);
    } else {
      logger.error('An unknown error occurred while starting the application');
    }
    process.exit(1);
  }
}

// Call bootstrap function
bootstrap().catch((error) => {
  console.error('Unhandled bootstrap error:', error);
  process.exit(1);
});

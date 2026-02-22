import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS with more specific configuration for production
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // Allow Vercel frontend or localhost
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

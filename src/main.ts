import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { adminSeed } from './database/seed/admin.seed';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // removes extra fields
      forbidNonWhitelisted: true, // throws error on extra fields
      transform: true,          // auto converts types
    }),
  );

  const dataSource = app.get(DataSource);
  await adminSeed(dataSource);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

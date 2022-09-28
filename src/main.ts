import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { AppDataSource } from './database';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

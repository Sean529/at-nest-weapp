import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(
    '%c 🥝 http://localhost:3000 🥝',
    'font-size:13px; background:#de4307; color:#f6d04d;',
  );
  await app.listen(3000);
}
bootstrap();

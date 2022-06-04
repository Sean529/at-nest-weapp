import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Log4jsLogger } from '@nestx-log4js/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  app.useLogger(app.get(Log4jsLogger));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(9529);
}

bootstrap().then(() => {
  logger.log('🥝 http://localhost:9529 🥝');
});

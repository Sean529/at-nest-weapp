import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { Log4jsModule } from '@nestx-log4js/core';

@Module({
  imports: [
    UserModule,
    Log4jsModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ilovewall'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

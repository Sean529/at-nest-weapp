import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    RedisModule.register(options),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

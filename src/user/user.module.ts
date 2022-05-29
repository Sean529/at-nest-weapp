import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from 'nestjs-http-promise';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { UserSchema } from '../schema/user.schema';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    MongooseModule.forFeature([
      { collection: 'userInfo', name: 'UserInfo', schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, CacheService],
})
export class UserModule {}

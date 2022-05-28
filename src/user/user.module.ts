import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user.schema';
import { HttpModule } from 'nestjs-http-promise';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';

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

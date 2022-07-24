import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { UserInfo } from '../entity/userInfo.entity';

@Module({
  imports: [HttpModule, CacheModule, TypeOrmModule.forFeature([UserInfo])],
  controllers: [UserController],
  providers: [UserService, CacheService],
})
export class UserModule {}

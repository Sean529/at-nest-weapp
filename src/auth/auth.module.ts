import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from 'nestjs-http-promise';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserInfo } from '../entity/userInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

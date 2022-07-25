import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EssayController } from './essay.controller';
import { EssayService } from './essay.service';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { UserEssay } from '../entity/userEssay.entity';
import { UserInfo } from '../entity/userInfo.entity';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    TypeOrmModule.forFeature([UserEssay]),
    TypeOrmModule.forFeature([UserInfo]),
  ],
  controllers: [EssayController],
  providers: [EssayService, CacheService],
})
export class EssayModule {}

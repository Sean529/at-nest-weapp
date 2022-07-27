import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from 'nestjs-http-promise';

import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { EssayCommentController } from './comment.controller';
import { EssayCommentService } from './comment.service';
import { EssayComment } from '../entity/essayComment.entity';
import { UserEssay } from '../entity/userEssay.entity';
import { UserInfo } from '../entity/userInfo.entity';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    TypeOrmModule.forFeature([EssayComment]),
    TypeOrmModule.forFeature([UserInfo]),
    TypeOrmModule.forFeature([UserEssay]),
  ],
  controllers: [EssayCommentController],
  providers: [EssayCommentService, CacheService],
})
export class EssayCommentModule {}

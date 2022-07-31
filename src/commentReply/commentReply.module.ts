import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from 'nestjs-http-promise';

import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { CommentReplyController } from './commentReply.controller';
import { EssayCommentReplyService } from './commentReply.service';
import { EssayComment } from '../entity/essayComment.entity';
import { UserInfo } from '../entity/userInfo.entity';
import { EssayCommentReply } from '../entity/commentReply.entity';
import { UserEssay } from '../entity/userEssay.entity';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    TypeOrmModule.forFeature([EssayCommentReply]),
    TypeOrmModule.forFeature([UserEssay]),
    TypeOrmModule.forFeature([EssayComment]),
    TypeOrmModule.forFeature([UserInfo]),
  ],
  controllers: [CommentReplyController],
  providers: [EssayCommentReplyService, CacheService],
})
export class CommentReplyModule {}

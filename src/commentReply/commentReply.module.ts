import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from 'nestjs-http-promise';

import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { CommentReplyController } from './commentReply.controller';
import { EssayCommentReplyService } from './commentReply.service';
import { CommentReplyConfig, CommentReplySchema } from './commentReply.schema';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    MongooseModule.forFeature([
      {
        collection: CommentReplyConfig.collection,
        name: CommentReplyConfig.name,
        schema: CommentReplySchema,
      },
    ]),
  ],
  controllers: [CommentReplyController],
  providers: [EssayCommentReplyService, CacheService],
})
export class CommentReplyModule {}

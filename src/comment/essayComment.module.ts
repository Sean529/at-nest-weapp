import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { MongooseModule } from '@nestjs/mongoose';

import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { EssayCommentController } from './essayComment.controller';
import { EssayCommentService } from './essayComment.service';
import { EssayCommentConfig, EssayCommentSchema } from './essayComment.schema';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    MongooseModule.forFeature([
      {
        collection: EssayCommentConfig.collection,
        name: EssayCommentConfig.name,
        schema: EssayCommentSchema,
      },
    ]),
  ],
  controllers: [EssayCommentController],
  providers: [EssayCommentService, CacheService],
})
export class EssayCommentModule {}

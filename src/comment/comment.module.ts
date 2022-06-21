import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';
import { MongooseModule } from '@nestjs/mongoose';

import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { EssayCommentController } from './comment.controller';
import { EssayCommentService } from './comment.service';
import { EssayCommentConfig, EssayCommentSchema } from './comment.schema';

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
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from 'nestjs-http-promise';

import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { EssayCommentController } from './comment.controller';
import { EssayCommentService } from './comment.service';

@Module({
  imports: [HttpModule, CacheModule, TypeOrmModule.forFeature([UserEssay])],
  controllers: [EssayCommentController],
  providers: [EssayCommentService, CacheService],
})
export class EssayCommentModule {}

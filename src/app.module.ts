import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EssayModule } from './essay/essay.module';
import { EssayCommentModule } from './comment/comment.module';
import { CommentReplyModule } from './commentReply/commentReply.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ilovewall'),
    Log4jsModule.forRoot(),
    UserModule,
    AuthModule,
    EssayModule,
    EssayCommentModule,
    CommentReplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

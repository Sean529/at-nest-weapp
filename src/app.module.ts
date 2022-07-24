import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { EssayModule } from './essay/essay.module';
// import { EssayCommentModule } from './comment/comment.module';
// import { CommentReplyModule } from './commentReply/commentReply.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      port: 3306,
      type: 'mysql',
      username: 'root',
      host: 'localhost',
      charset: 'utf8mb4',
      password: 'qwer1234',
      database: 'test',
      synchronize: true,
      autoLoadEntities: true,
    }),
    Log4jsModule.forRoot(),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

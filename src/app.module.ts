import { Module } from '@nestjs/common';
import { Log4jsModule } from '@nestx-log4js/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EssayModule } from './essay/essay.module';
import { EssayCommentModule } from './comment/comment.module';
import { CommentReplyModule } from './commentReply/commentReply.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'default',
      useFactory: async (config: ConfigService) => {
        return {
          type: 'mysql',
          maxQueryExecutionTime: 200,
          logging: true,
          autoLoadEntities: true,
          host: 'localhost', // 主机，默认为localhost
          port: 3306, // 端口号
          username: 'root', // 用户名
          charset: 'utf8mb4',
          password: 'qwer1234', // 密码
          database: 'test', // 数据库名
          timezone: '+08:00', // 服务器上配置的时区
          synchronize: true, // 根据实体自动创建数据库表，生产环境建议挂你
        };
      },
    }),
    Log4jsModule.forRoot(),
    AuthModule,
    UserModule,
    EssayModule,
    EssayCommentModule,
    CommentReplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

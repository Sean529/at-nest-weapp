import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from 'nestjs-http-promise';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserInfo } from '../entity/userInfo.entity';
import { JWT_CONSTANTS } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { CacheService } from '../cache/cache.service';
import { CacheModule } from '../cache/cache.module';

const jwtModule = JwtModule.registerAsync({
  useFactory: () => {
    return {
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: JWT_CONSTANTS.expiresIn },
    };
  },
});
@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    HttpModule,
    jwtModule,
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CacheService],
})
export class AuthModule {}

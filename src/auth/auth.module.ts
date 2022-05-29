import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from 'nestjs-http-promise';

import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';
import { UserSchema } from '../schema/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const jwtModule = JwtModule.registerAsync({
  useFactory: () => {
    return {
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    };
  },
});

const mongooseModule = MongooseModule.forFeature([
  { collection: 'userInfo', name: 'UserInfo', schema: UserSchema },
]);

@Module({
  imports: [HttpModule, PassportModule, jwtModule, mongooseModule, CacheModule],
  controllers: [AuthController],
  providers: [JwtStrategy, CacheService, AuthService],
})
export class AuthModule {}

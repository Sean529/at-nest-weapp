import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { JWT_CONSTANTS } from './constants';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret,
      passReqToCallback: true,
    });
  }

  /**
   * 过期以及弃用的 token 无效处理
   * @param req 请求报文
   * @param payload {userId: '', openId: ''}
   * @returns payload
   */
  async validate(req, payload: any) {
    const { token } = req.headers;
    const redisToken = await this.cacheService.get(`token_${payload.userId}`);
    if (redisToken && token !== redisToken) {
      throw new UnauthorizedException('token 不正确');
    }
    return payload;
  }
}

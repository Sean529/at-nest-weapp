import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from 'nestjs-http-promise';
import { CacheService } from '../cache/cache.service';
import { Repository } from 'typeorm';

import { UserInfo } from '../entity/userInfo.entity';
import { generateId, TWO_DAYS, TWO_HOUR } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

  getList() {
    return this.userRepository.find();
  }

  // 登录
  login = async (weappCode: string): Promise<any> => {
    const { openId, sessionKey, code, msg } = await this.loginWithWechat(
      weappCode,
    );

    if (code !== 200) {
      throw new HttpException(msg, code);
    }

    // 使用 openId 去数据库查用户信息
    let userInfo = await this.getUserInfo('openId', openId);

    // 如果数据库中没有用户信息，则创建一条
    if (!userInfo) {
      userInfo = await this.generateUserInfo(openId);
    }

    const { userId } = userInfo;

    // 生成 token
    const token = await this.generateToken({ userId, openId });

    // 缓存 session_key 到 Redis
    await this.cacheService.set(`sessionKey_${userId}`, sessionKey, TWO_DAYS);

    // 将用户信息缓存到 redis
    await this.cacheService.set(userId, userInfo, TWO_DAYS);

    return {
      code: 200,
      msg: '成功',
      data: {
        userInfo,
        token,
      },
    };
  };

  // 微信 code2session
  loginWithWechat = async (code: string): Promise<any> => {
    // 使用爱上刷题小程序进行测试
    const params = `appid=wxf5783118732fbb3b&secret=afd85101b32c44de9ccf0083c7096d62&js_code=${code}&grant_type=authorization_code`;
    const res = await this.httpService.get(
      `https://api.weixin.qq.com/sns/jscode2session?${params}`,
    );
    const { data } = res;
    if (data?.errcode) {
      return {
        code: data.errcode,
        msg: data.errmsg,
      };
    }
    return {
      openId: data.openid,
      sessionKey: data.session_key,
      code: 200,
      msg: '',
    };
  };

  getUserInfo = async (key: string, value) => {
    return await this.userRepository.findOne({ where: { [key]: value } });
  };

  // 生成 token
  generateToken = async ({ userId, openId }): Promise<string> => {
    const token = this.jwtService.sign({ userId, openId });
    await this.cacheService.set(`token_${userId}`, token, TWO_HOUR);
    return token;
  };

  // 创建用户
  generateUserInfo = async (openId: string): Promise<any> => {
    const uuid: number = await generateId();

    // NOTE: 查询 userId 在库中是否存在，若存在则重新生成
    const user = await this.getUserInfo('userId', +uuid);
    if (user) {
      this.generateUserInfo(openId);
    } else {
      // 创建用户存储到数据库
      const userInfo = new UserInfo();
      userInfo.userId = uuid;
      userInfo.openId = openId;
      return await this.userRepository.save(userInfo);
    }
  };
}

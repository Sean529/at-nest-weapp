import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from 'nestjs-http-promise';

import { UserDocument } from '../schema/user.schema';
import { CacheService } from '../cache/cache.service';
import { IUser } from '../user/user.type';
import { generateId, TWO_DAYS, TWO_HOUR } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  // 登录
  login = async (weappCode: string): Promise<any> => {
    const { openId, sessionKey, code, msg } = await this.loginWithWechat(
      weappCode,
    );

    if (code !== 200) {
      throw new HttpException(msg, code);
    }

    // 使用 openId 去数据库查用户信息
    let userInfo = await this.getUserInfoByOpenId(openId);

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
      msg: '',
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

  // 库中通过 openId 查用户信息
  getUserInfoByOpenId = async (openId: string): Promise<UserDocument> => {
    return await this.userModel.findOne({ openId });
  };

  // 生成 token
  generateToken = async (payload): Promise<string> => {
    const { userId } = payload;
    const token = this.jwtService.sign(payload);
    await this.cacheService.set(`token_${userId}`, token, TWO_HOUR);
    return token;
  };

  // 创建用户
  generateUserInfo = async (openId): Promise<UserDocument> => {
    const userId = await generateId();
    const userInfo: IUser = {
      userId,
      openId,
    };

    const createUser = new this.userModel(userInfo);
    return await createUser.save();
  };
}

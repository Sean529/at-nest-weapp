import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from 'nestjs-http-promise';
import { UserDocument } from '../schema/user.schema';

import { CacheService } from '../cache/cache.service';
import { UserInfoDto } from '../user/user.dto';
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
  async login(code: string): Promise<any> {
    const { openId, sessionKey, errCode, errMsg } = await this.loginWithWechat(
      code,
    );

    if (errCode !== 200) {
      return {
        errCode,
        errMsg,
      };
    }

    // 使用 openId 去数据库查用户信息
    let userInfo = await this.getUserInfoByOpenId(openId);

    // 如果数据库中没有用户信息，则创建一条
    if (!userInfo) {
      userInfo = await this.generateUserInfo({ openId });
    }
    const { userId } = userInfo;

    // 生成 token
    const token = await this.generateToken({ userId, openId });

    // 通过小程序的 code 获取微信服务的 session_key 时出错，则将错误信息抛给前端
    if (errCode !== 200) {
      return {
        code: errCode,
        msg: errMsg,
        data: null,
      };
    }

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
  }

  // 微信 code2session
  async loginWithWechat(code: string): Promise<any> {
    // 使用爱上刷题小程序进行测试
    const params = `appid=wxf5783118732fbb3b&secret=afd85101b32c44de9ccf0083c7096d62&js_code=${code}&grant_type=authorization_code`;
    const res = await this.httpService.get(
      `https://api.weixin.qq.com/sns/jscode2session?${params}`,
    );
    const { data } = res;
    if (data?.errcode) {
      return {
        errCode: data.errcode,
        errMsg: data.errmsg,
      };
    }
    return {
      openId: data.openid,
      sessionKey: data.session_key,
      errCode: 200,
      errMsg: '',
    };
  }

  // 库中通过 openId 查用户信息
  async getUserInfoByOpenId(openId: string): Promise<any> {
    return await this.userModel.findOne({ openId });
  }

  // 生成 token
  async generateToken(payload): Promise<any> {
    const { userId } = payload;
    const token = this.jwtService.sign(payload);
    await this.cacheService.set(`token_${userId}`, token, TWO_HOUR);
    return token;
  }

  // 创建用户
  async generateUserInfo({ openId, nickname, gender, avatar }: UserInfoDto) {
    const userId = await generateId();
    const userInfo: UserInfoDto = {
      userId,
      openId,
      nickname: nickname || '',
      gender: gender || 0,
      avatar: avatar || '',
      createTime: new Date().getTime(),
      updateTime: new Date().getTime(),
    };

    const createUser = new this.userModel(userInfo);
    return await createUser.save();
  }
}

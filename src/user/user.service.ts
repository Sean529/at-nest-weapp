import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserInfo, UserDocument } from 'src/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';
import { JwtService } from '@nestjs/jwt';

import { CacheService } from '../cache/cache.service';
import { generateId, TWO_DAYS, TWO_HOUR } from '../utils';
import { UserInfoDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserInfo') private userTest: Model<UserDocument>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  // 查找
  async findOne(name: string): Promise<UserInfo[]> {
    // 这里是异步的
    const temp = await this.userTest.find({ name });
    return temp;
  }

  async getLogin(code: string): Promise<any> {
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

  // 生成 token
  async generateToken(payload): Promise<any> {
    const { userId } = payload;
    const token = this.jwtService.sign(payload);
    await this.cacheService.set(`token_${userId}`, token, TWO_HOUR);
    return token;
  }

  async getUserInfoByOpenId(openId: string): Promise<any> {
    return await this.userTest.findOne({ openId });
  }

  async createUserInfo({ openId, nickname, gender, avatar }: UserInfoDto) {
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

    const createUser = new this.userTest(userInfo);
    return await createUser.save();
  }

  async login(code: string): Promise<any> {
    const { openId, sessionKey, errCode, errMsg } = await this.getLogin(code);

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
      userInfo = await this.createUserInfo({ openId });
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
      data: {
        userInfo,
        token,
      },
      msg: '',
    };
  }

  async test() {
    await this.cacheService.set('name', 'AT');
    const temp = await this.cacheService.get('name');
    return temp;
  }

  // 保存用户信息到数据库和缓存
  async saveUserInfoToDB({ userId, userInfo }): Promise<any> {
    const updateTime = new Date().getTime();

    // 更新数据库中用户信息
    const temp = await this.userTest.updateOne(
      { userId },
      { ...userInfo, updateTime },
    );

    // 更新 redis 用户信息
    await this.cacheService.set(userId, userInfo);

    return {
      code: 200,
      msg: '',
      data: temp,
    };
  }

  // 更新用户信息
  async updateUserInfo(userInfo: UserInfoDto): Promise<any> {
    const { userId } = userInfo;
    // 通过 userId 从 Redis 中获取用户信息
    const userRedis = await this.cacheService.get(userId);
    if (userRedis) {
      return await this.saveUserInfoToDB({ userId, userInfo });
    }

    const userDB = await this.userTest.findOne({ userId });
    if (!userDB) {
      return {
        code: 400,
        msg: '用户不存在',
        data: null,
      };
    }

    return await this.saveUserInfoToDB({ userId, userInfo });
  }

  // 返回用户信息
  resultUserInfo(userInfo: UserInfoDto): any {
    return {
      code: 200,
      msg: '',
      data: userInfo,
    };
  }

  // 获取用户信息
  async getUserInfo(userId: string): Promise<UserInfoDto & any> {
    console.log(
      '%c AT 🥝 userId 🥝-182',
      'font-size:13px; background:#de4307; color:#f6d04d;',
      userId,
    );
    // 从 Redis 中获取用户信息
    const userRedis = await this.cacheService.get(userId);
    if (userRedis) {
      // 返回用户信息
      return this.resultUserInfo(userRedis);
    }

    // 从数据库中获取用户信息
    const userDB = await this.userTest.findOne({ userId });
    if (!userDB) {
      return {
        code: 400,
        msg: '用户不存在',
        data: null,
      };
    }
    // 更新 redis 用户信息
    await this.cacheService.set(userId, userDB);
    // 返回用户信息
    return this.resultUserInfo(userRedis);
  }
}

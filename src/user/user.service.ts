import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { UserInfoDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userTest: Model<UserDocument>,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  // 查找
  async findOne(name: string): Promise<User[]> {
    // 这里是异步的
    const temp = await this.userTest.find({ name });
    return temp;
  }

  async getCode2Session(code: string): Promise<any> {
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

  // TODO: token 生成方式需参考下业内方案
  createToken(sessionKey: string, openId: string): string {
    return `${openId}_${sessionKey}`;
  }

  async openIdFindUserInfo(openId: string): Promise<any> {
    // 这里是异步的
    const temp = await this.userTest.findOne({ openId });
    return temp;
  }

  async createUserInfo({ openId, nickname, gender, avatar }: UserInfoDto) {
    const userInfo: UserInfoDto = {
      userId: 'mock0',
      openId,
      nickname: nickname || '',
      gender: gender || 0,
      avatar: avatar || '',
      createTime: new Date().getTime(),
      updateTime: new Date().getTime(),
    };

    const createUser = new this.userTest(userInfo);
    const temp = await createUser.save();
    return temp;
  }

  async code2Session(code: string): Promise<any> {
    const { openId, sessionKey, errCode, errMsg } = await this.getCode2Session(
      code,
    );

    // 生成 token
    const token = this.createToken(sessionKey, openId);

    // 使用 openId 去数据库查用户信息
    let userInfo = await this.openIdFindUserInfo(openId);

    // 如果数据库中没有用户信息，则创建一条
    if (!userInfo) {
      userInfo = await this.createUserInfo({ openId });
    }

    // 通过小程序的 code 获取微信服务的 session_key 时出错，则将错误信息抛给前端
    if (errCode !== 200) {
      return {
        code: errCode,
        msg: errMsg,
        data: null,
      };
    }

    // 缓存 token 到 Redis
    const TWO_DAYS = 2 * 24 * 3600 * 1000; // 两天的缓存时间，设置的比微信缓存时间短一点（3天）
    await this.cacheService.set('token', token, TWO_DAYS);

    // 将用户信息缓存到 redis
    await this.cacheService.set(openId, userInfo, TWO_DAYS);

    return {
      code: 200,
      data: {
        userInfo,
        token,
      },
      msg: '',
    };
  }

  async getGitee(): Promise<any> {
    const google = await this.httpService.get('https://gitee.com/');
    return google.data;
  }

  async test() {
    await this.cacheService.set('name', 'AT');
    const temp = await this.cacheService.get('name');
    console.log(
      '%c AT-🥝 temp 🥝-127',
      'font-size:13px; background:#de4307; color:#f6d04d;',
      temp,
    );
    return temp;
  }

  // 保存用户信息到数据库和缓存
  async saveUserInfoToDB({ openId, userInfo }): Promise<any> {
    const updateTime = new Date().getTime();

    // 更新数据库中用户信息
    const temp = await this.userTest.updateOne(
      { openId },
      { ...userInfo, updateTime },
    );

    // 更新 redis 用户信息
    await this.cacheService.set(openId, userInfo);

    return {
      code: 200,
      msg: '',
      data: temp,
    };
  }

  // 更新用户信息
  async updateUserInfo(userInfo: UserInfoDto): Promise<any> {
    const { openId } = userInfo;
    // 通过 openId 从 Redis 中获取用户信息
    const userRedis = await this.cacheService.get(openId);
    if (userRedis) {
      return await this.saveUserInfoToDB({ openId, userInfo });
    }

    const userDB = await this.userTest.findOne({ openId });
    if (!userDB) {
      return {
        code: 400,
        msg: '用户不存在',
        data: null,
      };
    }

    return await this.saveUserInfoToDB({ openId, userInfo });
  }
}

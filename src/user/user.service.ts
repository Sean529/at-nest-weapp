import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { UserDocument } from '../schema/user.schema';
import { CacheService } from '../cache/cache.service';
import { UserInfoDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserInfo') private userInfoModel: Model<UserDocument>,
    private readonly cacheService: CacheService,
  ) {}

  async test() {
    await this.cacheService.set('name', 'AT');
    const temp = await this.cacheService.get('name');
    return temp;
  }

  // 保存用户信息到数据库和缓存
  async saveUserInfoToDB({ userId, userInfo }): Promise<any> {
    const updateTime = new Date().getTime();

    // 更新数据库中用户信息
    const temp = await this.userInfoModel.updateOne(
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

    const userDB = await this.userInfoModel.findOne({ userId });
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
    // 从 Redis 中获取用户信息
    const userRedis = await this.cacheService.get(userId);
    if (userRedis) {
      // 返回用户信息
      return this.resultUserInfo(userRedis);
    }

    // 从数据库中获取用户信息
    const userDB = await this.userInfoModel.findOne({ userId });
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

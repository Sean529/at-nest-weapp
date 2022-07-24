import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// import { UserDocument } from '../schema/user.schema';
import { CacheService } from '../cache/cache.service';
import { UserDto } from './user.dto';
import { UserInfo } from '../entity/userInfo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
    private readonly cacheService: CacheService,
  ) {}

  async test() {
    await this.cacheService.set('name', 'AT');
    const temp = await this.cacheService.get('name');
    return temp;
  }

  // 保存用户信息到数据库和缓存
  async saveUserInfoToDB(updateUserInfo): Promise<any> {
    const { userId } = updateUserInfo;

    const userInfoDB = await this.userRepository.findOne({ where: { userId } });

    const newUserInfo = {
      ...userInfoDB,
      ...updateUserInfo,
    };

    // 更新数据库中用户信息
    await this.userRepository.save(newUserInfo);

    // 更新 redis 用户信息
    await this.cacheService.set(userId, newUserInfo);

    return {
      code: 200,
      msg: '',
      data: newUserInfo,
    };
  }

  // 更新用户信息
  async updateUserInfo(payloadUserInfo: UserDto, userId: number): Promise<any> {
    // 通过 userId 从 Redis 中获取用户信息
    const userRedis = await this.cacheService.get(userId);

    const updateUserInfo = this.getUpdateUserInfo(userId, payloadUserInfo);
    if (userRedis) {
      return await this.saveUserInfoToDB(updateUserInfo);
    }

    const userDB = await this.userRepository.findOne({ where: { userId } });
    if (!userDB) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    return await this.saveUserInfoToDB(updateUserInfo);
  }

  // 组装新的用户信息
  getUpdateUserInfo = (userId: number, payloadUserInfo: UserDto) => {
    return {
      ...payloadUserInfo,
      userId,
    };
  };

  // 返回用户信息
  resultUserInfo(userInfo: UserDto): any {
    return {
      code: 200,
      msg: '',
      data: userInfo,
    };
  }

  // 获取用户信息
  async getUserInfo(userId: number): Promise<UserDto & any> {
    // 从 Redis 中获取用户信息
    const userRedis = await this.cacheService.get(userId);
    if (userRedis) {
      // 返回用户信息
      return this.resultUserInfo(userRedis);
    }

    // 从数据库中获取用户信息
    const userDB = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!userDB) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    // 更新 redis 用户信息
    await this.cacheService.set(userId, userDB);

    // 返回用户信息
    return this.resultUserInfo(userRedis);
  }
}

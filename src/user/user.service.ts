import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateUserDto, CreateUserInfoDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';

@Injectable()
export class UserService {
  // 注册 Schema 后，可以使用 @InjectModel() 装饰器将 User 模型注入到 UserService 中:
  constructor(
    @InjectModel('User') private userTest: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) {}

  // 添加
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userTest(createUserDto);
    const temp = await createUser.save();
    return temp;
  }

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

  getToken(sessionKey: string, openId: string): string {
    return `${sessionKey}_${openId}`;
  }

  async openIdFindUserInfo(openId: string): Promise<any> {
    // 这里是异步的
    const temp = await this.userTest.findOne({ openId });
    return temp;
  }

  async createUserInfo({
    openId,
    nickname,
    gender,
    avatar,
  }: CreateUserInfoDto) {
    const userInfo: CreateUserInfoDto = {
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

    // 1. sessionKey + openId 生成 token
    const token = this.getToken(sessionKey, openId);

    // 2. 拿 openId 去数据库查用户信息

    // 3. 存入 Redis

    const userInfo = await this.openIdFindUserInfo(openId);

    // 如果数据库中没有用户信息，则创建一条
    if (!userInfo) {
      const data = await this.createUserInfo({ openId });
    }

    // 缓存 token 到 Redis

    if (errCode !== 200) {
      return {
        code: errCode,
        msg: errMsg,
        data: null,
      };
    }

    return {
      code: 200,
      data: {
        openId,
      },
    };
  }

  async getGitee(): Promise<any> {
    const google = await this.httpService.get('https://gitee.com/');
    return google.data;
  }
}

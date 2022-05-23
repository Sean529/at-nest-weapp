import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateUserDto } from './user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // 注册 Schema 后，可以使用 @InjectModel() 装饰器将 User 模型注入到 UserService 中:
  constructor(@InjectModel('User') private userTest: Model<UserDocument>) {}

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
}

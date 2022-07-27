import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateId } from '../utils';
import { IResponse } from '../type/response.type';
import { EssayType, IUserEssay } from './essay.type';
import { UserEssay } from '../entity/userEssay.entity';
import { CreateUserEssayDto } from '../dto/createUserEssay.dto';
import { UserInfo } from '../entity/userInfo.entity';

@Injectable()
export class EssayService {
  constructor(
    @InjectRepository(UserEssay)
    private userEssayRepository: Repository<UserEssay>,
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
  ) {}

  // 创建文章
  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content } = body;
    const essayInfo: IUserEssay = await this.generateEssay(userId, content);
    return {
      code: 200,
      msg: '',
      data: essayInfo,
    };
  };

  getUserEssayInfo = async (key: string, value) => {
    return await this.userEssayRepository.findOne({ where: { [key]: value } });
  };

  generateEssay = async (
    userId: number,
    content: string,
  ): Promise<IUserEssay> => {
    const essayId: number = await generateId();
    const essay = await this.getUserEssayInfo('essayId', essayId);
    if (essay) {
      this.generateEssay(userId, content);
    } else {
      const essayInfo = new CreateUserEssayDto();
      essayInfo.essayId = essayId;
      essayInfo.content = content;
      // TODO: 默认0，如果传了 image 要改成1
      essayInfo.type = EssayType.TEXT;
      // 关联 user 表
      essayInfo.userInfo = await this.userRepository.findOne({
        where: { userId },
      });
      return await this.userEssayRepository.save(essayInfo);
    }
  };

  // 文章列表
  list = async (page = 1, pageSize = 10) => {
    // string 转 number
    page = Number(page) - 1; // 数据库从 0 开始计数
    pageSize == Number(pageSize);

    // 总条数
    const [list, total] = await this.userEssayRepository
      .createQueryBuilder('essay')
      .leftJoinAndSelect('essay.userInfo', 'user_id')
      .orderBy('essay.createdAt', 'DESC')
      .take(pageSize) // 取n条
      .skip(pageSize * page) // 跳过n条
      .getManyAndCount();

    // 表中无数据
    if (!total) {
      return {
        code: 200,
        msg: '',
        data: {
          list: [],
          hasNextPage: false,
          total: 0,
        },
      };
    }

    // 是否有下一页
    const hasNextPage: boolean = (page + 1) * pageSize < total;

    return {
      code: 200,
      msg: '',
      data: {
        list: list,
        hasNextPage,
        total,
      },
    };
  };
}

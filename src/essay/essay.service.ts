import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserEssayDocument } from '../schema/essay.schema';
import { generateId } from '../utils';
import { IEssay } from './essay.type';
import { IResponse } from 'src/type/response.type';

@Injectable()
export class EssayService {
  constructor(
    @InjectModel('UserEssay') private EssayModel: Model<UserEssayDocument>,
  ) {}

  // 创建文章
  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content } = body;
    const essayInfo: IEssay = await this.generateEssay(userId, content);
    return {
      code: 200,
      msg: '',
      data: essayInfo,
    };
  };

  generateEssay = async (userId: string, content: string): Promise<IEssay> => {
    const essayId: string = await generateId();
    const essayInfo: IEssay = {
      essayId,
      userId,
      content,
      type: 0,
      auditStatus: 0,
      isDelete: false,
      deleteTime: null,
      createTime: new Date().getTime(),
      updateTime: new Date().getTime(),
    };
    const createEssay: UserEssayDocument = new this.EssayModel(essayInfo);
    return await createEssay.save();
  };

  // 文章列表
  list = async (page = 0, pageSize = 10): Promise<IResponse> => {
    // string 转 number
    page = Number(page);
    pageSize == Number(pageSize);

    // 总条数
    const total: number = await this.EssayModel.find().count();

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

    // 列表
    const dataList: IEssay[] = await this.EssayModel.find()
      .skip(page * pageSize)
      .limit(pageSize);

    return {
      code: 200,
      msg: '',
      data: {
        list: dataList,
        hasNextPage,
        total,
      },
    };
  };
}

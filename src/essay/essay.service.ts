import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { EssayDocument } from '../schema/essay.schema';
import { generateId } from '../utils';
import { IEssay } from './essay.type';

@Injectable()
export class EssayService {
  constructor(@InjectModel('Essay') private EssayModel: Model<EssayDocument>) {}

  // 创建文章
  create = async (body, user): Promise<IEssay> => {
    const { userId } = user;
    const { content } = body;
    return await this.generateEssay(userId, content);
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
    const createEssay: EssayDocument = new this.EssayModel(essayInfo);
    return await createEssay.save();
  };
}

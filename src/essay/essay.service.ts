import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { EssayDocument } from '../schema/essay.schema';
import { generateId } from '../utils';

@Injectable()
export class EssayService {
  constructor(@InjectModel('Essay') private EssayModel: Model<EssayDocument>) {}

  async create(body, user) {
    const { userId } = user;
    const { content } = body;
    const essayInfo = await this.generateEssay(userId, content);
    return essayInfo;
  }

  async generateEssay(userId, content) {
    const essayId = await generateId();
    const essayInfo = {
      essayId,
      userId,
      content,
      type: 0, // 仅文字
      auditStatus: 0, // 待审核
      isDelete: false,
      deleteTime: null,
      createTime: new Date().getTime(),
      updateTime: new Date().getTime(),
    };
    const createEssay = new this.EssayModel(essayInfo);
    return await createEssay.save();
  }
}

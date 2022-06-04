import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserEssay extends Document {
  @Prop({
    required: true,
  })
  essayId: string;

  @Prop({
    required: true,
    description: '发表人ID',
  })
  userId: string; // 发表人

  @Prop({
    required: true,
    description: '文字内容',
  })
  content: string;

  @Prop({
    required: true,
    description: '区分内容中是否包含图片',
    default: 0,
  })
  type: number; // 0 仅文字，1图文

  @Prop({
    description: '审核状态',
    default: 0,
  })
  auditStatus: number; // 审核状态 0 待审核 1 审核通过 2 审核不通过

  @Prop({
    description: '是否被删除',
    default: false,
  })
  isDelete: boolean;

  @Prop({
    description: '删除时间',
    default: null,
  })
  deleteTime: number; // 删除时间

  @Prop({
    description: '创建时间',
    default: Date.now(),
  })
  createTime: number;

  @Prop({
    description: '更新时间',
    default: Date.now(),
  })
  updateTime: number;
}

export const UserEssaySchema = SchemaFactory.createForClass(UserEssay);
export type UserEssayDocument = UserEssay & Document;

export const UserEssayConfig = {
  collection: 'user_essay',
  name: 'UserEssay',
};

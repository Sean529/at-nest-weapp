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
    description: '发布者ID',
  })
  userId: string; // 发表人

  @Prop({
    required: true,
    description: '文字内容',
    trim: true,
  })
  content: string;

  @Prop({
    required: true,
    description: '动态类型,1:纯文本，2:图文',
    default: 1,
  })
  type: number;

  @Prop({
    description: '审核状态,0:待审核,1:通过,2:拒绝',
    default: 0,
  })
  auditStatus: number;

  @Prop({
    description: '是否已删除',
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    description: '删除时间',
    default: null,
  })
  deleteTime: number;

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

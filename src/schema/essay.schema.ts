import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserEssay extends Document {
  @Prop()
  essayId: string;

  @Prop()
  userId: string; // 发表人

  @Prop()
  content: string; // 文字内容

  @Prop()
  type: number; // 0 仅文字，1图文

  @Prop()
  auditStatus: number; // 审核状态 0 待审核 1 审核通过 2 审核不通过

  @Prop()
  isDelete: boolean; // 文章是否被删除

  @Prop()
  deleteTime: number; // 删除时间

  @Prop()
  createTime: number;

  @Prop()
  updateTime: number;
}

export const EssaySchema = SchemaFactory.createForClass(UserEssay);
export type UserEssayDocument = UserEssay & Document;

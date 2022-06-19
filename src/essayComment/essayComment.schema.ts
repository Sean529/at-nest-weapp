import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EssayComment extends Document {
  @Prop({
    required: true,
  })
  commentId: string;

  @Prop({
    required: true,
    description: '评论人用户ID',
  })
  userId: string;

  @Prop({
    required: true,
    description: '被评论动态ID',
  })
  essayId: string;

  @Prop({
    required: true,
    description: '评论文字内容',
    trim: true,
  })
  content: string;

  @Prop({
    required: true,
    description: '点赞数量',
    default: 0,
  })
  likes: number;

  @Prop({
    description: '回复数量',
    default: 0,
  })
  replyNum: number;

  @Prop({
    description: '是否已删除',
    default: false,
  })
  isDelete: boolean;

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
}

export const EssayCommentSchema = SchemaFactory.createForClass(EssayComment);
export type EssayCommentDocument = EssayComment & Document;

export const EssayCommentConfig = {
  collection: 'essay_comment',
  name: 'EssayComment',
};

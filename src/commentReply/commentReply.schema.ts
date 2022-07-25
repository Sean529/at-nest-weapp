import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CommentReply extends Document {
  @Prop({
    description: '回复评论ID',
  })
  replyId: string;

  @Prop({
    required: true,
    description: '动态评论ID',
  })
  commentId: number;

  @Prop({
    required: true,
    description: '回复人用户ID',
  })
  userId: string;

  @Prop({
    description: '被评论动态ID',
  })
  essayId: string;

  @Prop({
    description: '父回复ID。回复别人对评论的回复，别人的回复就是父回复',
    default: null,
  })
  parentReplyId: string;

  @Prop({
    description: '父回复的用户ID',
    default: null,
  })
  parentReplyUserId: string;

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
}

export const CommentReplySchema = SchemaFactory.createForClass(CommentReply);
export type CommentReplyDocument = CommentReply & Document;

export const CommentReplyConfig = {
  collection: 'essay_comment_reply',
  name: 'EssayCommentReply',
};

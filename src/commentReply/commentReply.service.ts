import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommentReplyDocument } from './commentReply.schema';
import { generateId } from '../utils';
import { ICommentReply } from './commentReply.type';
import { IResponse } from '../type/response.type';

@Injectable()
export class EssayCommentReplyService {
  constructor(
    @InjectModel('EssayCommentReply')
    private EssayCommentReplyModel: Model<CommentReplyDocument>,
  ) {}

  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content, commentId } = body;

    const commentInfo: ICommentReply = await this.generateComment(
      userId,
      commentId,
      content,
    );

    return {
      code: 200,
      msg: '',
      data: commentInfo,
    };
  };

  generateComment = async (
    userId: string,
    essayId: string,
    content: string,
  ): Promise<ICommentReply> => {
    const commentId: string = await generateId();
    const commentInfo: Partial<ICommentReply> = {
      commentId,
      userId,
      essayId,
      content,
    };
    const createComment: CommentReplyDocument = new this.EssayCommentReplyModel(
      commentInfo,
    );
    return await createComment.save();
  };
}

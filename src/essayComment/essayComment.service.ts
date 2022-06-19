import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateId } from 'src/utils';
import { EssayCommentDocument } from './essayComment.schema';

@Injectable()
export class EssayCommentService {
  constructor(
    @InjectModel('EssayComment')
    private CommentModel: Model<EssayCommentDocument>,
  ) {}

  create = async (body, user) => {
    const { userId } = user;
    const { content, essayId } = body;
    const commentInfo = await this.generateComment(userId, essayId, content);
    return {
      code: 200,
      msg: '',
      data: commentInfo,
    };
  };

  generateComment = async (userId, essayId, content) => {
    const commentId = await generateId();
    const commentInfo = {
      commentId,
      userId,
      essayId,
      content,
    };
    const createComment = new this.CommentModel(commentInfo);
    return await createComment.save();
  };
}

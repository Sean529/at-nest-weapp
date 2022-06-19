import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateId } from 'src/utils';
import { EssayCommentDocument } from './essayComment.schema';
import { IResponse } from '../type/response.type';
import { IEssayComment } from './essayComment.type';

@Injectable()
export class EssayCommentService {
  constructor(
    @InjectModel('EssayComment')
    private CommentModel: Model<EssayCommentDocument>,
  ) {}

  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content, essayId } = body;
    const commentInfo: IEssayComment = await this.generateComment(
      userId,
      essayId,
      content,
    );
    return {
      code: 200,
      msg: '',
      data: commentInfo,
    };
  };

  generateComment = async (
    userId,
    essayId,
    content,
  ): Promise<IEssayComment> => {
    const commentId: string = await generateId();
    const commentInfo: Partial<IEssayComment> = {
      commentId,
      userId,
      essayId,
      content,
    };
    const createComment: EssayCommentDocument = new this.CommentModel(
      commentInfo,
    );
    return await createComment.save();
  };
}

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
    const commentId: number = await generateId();
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

  getList = async (page = 1, pageSize = 10, commentId: string) => {
    // string 转 number
    page = Number(page) - 1; //从数据库从 0 开始计数
    pageSize = Number(pageSize);

    // 总条数
    const total: number = await this.EssayCommentReplyModel.find({
      commentId,
    }).count();

    // 表中无数据
    if (!total) {
      return {
        code: 200,
        msg: '',
        data: {
          list: [],
          hasNextPage: false,
          total: 0,
        },
      };
    }

    // 是否有下一页
    const hasNextPage: boolean = (page + 1) * pageSize < total;

    // 列表
    const dataList: ICommentReply[] = await this.EssayCommentReplyModel.find({
      commentId,
    })
      .sort({ createTime: -1 }) // 时间倒叙排列
      .skip(page * pageSize)
      .limit(pageSize);

    return {
      code: 200,
      msg: '',
      data: {
        list: dataList,
        hasNextPage,
        total,
      },
    };
  };
}

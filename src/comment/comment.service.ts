import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { generateId } from '../utils';
import { EssayCommentDocument } from './comment.schema';
import { IResponse } from '../type/response.type';
import { IEssayComment } from './comment.type';

@Injectable()
export class EssayCommentService {
  constructor(
    @InjectModel('EssayComment')
    private EssayCommentModel: Model<EssayCommentDocument>,
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
    userId: string,
    essayId: string,
    content: string,
  ): Promise<IEssayComment> => {
    const commentId: number = await generateId();
    const commentInfo: Partial<IEssayComment> = {
      commentId,
      userId,
      essayId,
      content,
    };
    const createComment: EssayCommentDocument = new this.EssayCommentModel(
      commentInfo,
    );
    return await createComment.save();
  };

  // 获取文章评论列表
  getList = async (page = 1, pageSize = 10, essayId): Promise<IResponse> => {
    // string 转 number
    page = Number(page) - 1; //从数据库从 0 开始计数
    pageSize = Number(pageSize);

    // 总条数
    const total: number = await this.EssayCommentModel.find({
      essayId,
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
    const dataList: IEssayComment[] = await this.EssayCommentModel.find({
      essayId,
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

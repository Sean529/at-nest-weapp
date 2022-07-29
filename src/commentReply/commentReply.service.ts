import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { generateId } from '../utils';
import { IResponse } from '../type/response.type';
import { CreateCommentReplyDto } from '../dto/createCommentReply.dto';
import { CommentReply } from '../entity/commentReply.entity';
import { UserInfo } from '../entity/userInfo.entity';
import { EssayComment } from '../entity/essayComment.entity';

@Injectable()
export class EssayCommentReplyService {
  constructor(
    @InjectRepository(CommentReply)
    private commentReplyRepository: Repository<CommentReply>,
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
    @InjectRepository(EssayComment)
    private essayCommentRepository: Repository<EssayComment>,
  ) {}

  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content, commentId } = body;

    const commentInfo = await this.generateComment(userId, commentId, content);

    return {
      code: 200,
      msg: '',
      data: commentInfo,
    };
  };

  generateComment = async (
    userId: number,
    commentId: number,
    content: string,
  ) => {
    const replyId: number = await generateId();
    const commentReply = new CreateCommentReplyDto();

    commentReply.replyId = replyId;
    commentReply.userInfo = await this.userRepository.findOne({
      where: { userId },
    });
    commentReply.commentInfo = await this.essayCommentRepository.findOne({
      where: { commentId },
    });
    commentReply.content = content;

    return await this.commentReplyRepository.save(commentReply);
  };

  // getList = async (page = 1, pageSize = 10, commentId: string) => {
  //   // string 转 number
  //   page = Number(page) - 1; //从数据库从 0 开始计数
  //   pageSize = Number(pageSize);

  //   // 总条数
  //   const total: number = await this.EssayCommentReplyModel.find({
  //     commentId,
  //   }).count();

  //   // 表中无数据
  //   if (!total) {
  //     return {
  //       code: 200,
  //       msg: '',
  //       data: {
  //         list: [],
  //         hasNextPage: false,
  //         total: 0,
  //       },
  //     };
  //   }

  //   // 是否有下一页
  //   const hasNextPage: boolean = (page + 1) * pageSize < total;

  //   // 列表
  //   const dataList: ICommentReply[] = await this.EssayCommentReplyModel.find({
  //     commentId,
  //   })
  //     .sort({ createTime: -1 }) // 时间倒叙排列
  //     .skip(page * pageSize)
  //     .limit(pageSize);

  //   return {
  //     code: 200,
  //     msg: '',
  //     data: {
  //       list: dataList,
  //       hasNextPage,
  //       total,
  //     },
  //   };
  // };
}

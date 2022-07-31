import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { generateId } from '../utils';
import { IResponse } from '../type/response.type';
import { CreateCommentReplyDto } from '../dto/createCommentReply.dto';
import { EssayCommentReply } from '../entity/commentReply.entity';
import { UserInfo } from '../entity/userInfo.entity';
import { EssayComment } from '../entity/essayComment.entity';
import { UserEssay } from '../entity/userEssay.entity';

@Injectable()
export class EssayCommentReplyService {
  constructor(
    @InjectRepository(EssayCommentReply)
    private commentReplyRepository: Repository<EssayCommentReply>,
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
    @InjectRepository(EssayComment)
    private essayCommentRepository: Repository<EssayComment>,
    @InjectRepository(UserEssay)
    private userEssayRepository: Repository<UserEssay>,
  ) {}

  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content, commentId, essayId } = body;

    const commentInfo = await this.generateComment({
      userId,
      commentId,
      essayId,
      content,
    });

    return {
      code: 200,
      msg: '',
      data: commentInfo,
    };
  };

  generateComment = async ({ userId, commentId, essayId, content }) => {
    const replyId: number = await generateId();
    const commentReply = new CreateCommentReplyDto();

    commentReply.replyId = replyId;
    commentReply.userInfo = await this.userRepository.findOne({
      where: { userId },
    });
    commentReply.commentInfo = await this.essayCommentRepository.findOne({
      where: { commentId },
    });
    commentReply.essayInfo = await this.userEssayRepository.findOne({
      where: { essayId },
    });
    commentReply.content = content;

    return await this.commentReplyRepository.save(commentReply);
  };

  // 表中无数据
  getNull = () => {
    return {
      code: 200,
      msg: '',
      data: {
        list: [],
        hasNextPage: false,
        total: 0,
      },
    };
  };

  getList = async (page = 1, pageSize = 10, commentId: number) => {
    // string 转 number
    page = Number(page) - 1; //从数据库从 0 开始计数
    pageSize = Number(pageSize);

    // 先查评论是否还存在
    const commentInfo = await this.essayCommentRepository.findOne({
      where: { commentId },
    });

    // 动态不存在，则返回空的评论列表
    if (!commentInfo) {
      return this.getNull();
    }

    // 总条数
    const [list, total] = await this.commentReplyRepository
      .createQueryBuilder('reply') // 表的别名
      .leftJoinAndSelect('reply.essayInfo', 'essay_id') // essay_id 是entity中的 JoinColumn name
      .leftJoinAndSelect('reply.commentInfo', 'comment_id')
      .leftJoinAndSelect('reply.userInfo', 'user_id')
      .orderBy('reply.createdAt', 'DESC')
      .where({ commentInfo }) // 通过评论信息查回复列表
      .take(pageSize) // 取n条
      .skip(pageSize * page) // 跳过n条
      .getManyAndCount();

    // 表中无数据
    if (!total) {
      return this.getNull();
    }

    // 是否有下一页
    const hasNextPage: boolean = (page + 1) * pageSize < total;

    return {
      code: 200,
      msg: '',
      data: {
        list: list,
        hasNextPage,
        total,
      },
    };
  };
}

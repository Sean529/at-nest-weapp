import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { generateId } from '../utils';
import { IResponse } from '../type/response.type';
import { EssayComment } from '../entity/essayComment.entity';
import { UserInfo } from '../entity/userInfo.entity';
import { UserEssay } from '../entity/userEssay.entity';
import { CreateEssayCommentDto } from '../dto/createEssayComment.dto';

@Injectable()
export class EssayCommentService {
  constructor(
    @InjectRepository(EssayComment)
    private essayCommentRepository: Repository<EssayComment>,
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
    @InjectRepository(UserEssay) private essayRepository: Repository<UserEssay>,
  ) {}

  create = async (body, user): Promise<IResponse> => {
    const { userId } = user;
    const { content, essayId } = body;
    const commentInfo = await this.generateComment(userId, essayId, content);
    return {
      code: 200,
      msg: '',
      data: commentInfo,
    };
  };

  generateComment = async (
    userId: number,
    essayId: number,
    content: string,
  ) => {
    const commentId: number = await generateId();
    const essayCommentInfo = new CreateEssayCommentDto();

    essayCommentInfo.commentId = commentId;
    essayCommentInfo.userInfo = await this.userRepository.findOne({
      where: { userId },
    });
    essayCommentInfo.essayInfo = await this.essayRepository.findOne({
      where: { essayId },
    });
    essayCommentInfo.content = content;

    return await this.essayCommentRepository.save(essayCommentInfo);
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

  // 获取文章评论列表
  getList = async (page = 1, pageSize = 10, essayId) => {
    // string 转 number
    page = Number(page) - 1; //从数据库从 0 开始计数
    pageSize = Number(pageSize);

    // 先查动态信息是否还存在
    const essayInfo = await this.essayRepository.findOne({
      where: { essayId },
    });

    // 动态不存在，则返回空的评论列表
    if (!essayInfo) {
      return this.getNull();
    }

    const [list, total] = await this.essayCommentRepository
      .createQueryBuilder('comment') // 表的别名
      .leftJoinAndSelect('comment.essayInfo', 'essay_id') // essay_id 是entity中的 JoinColumn name
      .leftJoinAndSelect('comment.userInfo', 'user_id')
      .orderBy('comment.createdAt', 'DESC')
      .where({ essayInfo }) // 通过动态信息查评论
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
        list,
        hasNextPage,
        total,
      },
    };
  };
}

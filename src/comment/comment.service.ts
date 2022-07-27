import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { generateId } from '../utils';
import { IResponse } from '../type/response.type';
import { EssayComment } from '../entity/essayComment.entity';
import { CreateEssayCommentDto } from '../dto/createEssayComment.dto';
import { UserInfo } from '../entity/userInfo.entity';
import { UserEssay } from '../entity/userEssay.entity';

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

  // 获取文章评论列表
  // getList = async (page = 1, pageSize = 10, essayId): Promise<IResponse> => {
  //   // string 转 number
  //   page = Number(page) - 1; //从数据库从 0 开始计数
  //   pageSize = Number(pageSize);

  //   // 总条数
  //   const total: number = await this.EssayCommentModel.find({
  //     essayId,
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
  //   const dataList: IEssayComment[] = await this.EssayCommentModel.find({
  //     essayId,
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

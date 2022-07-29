import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CommentReplyDto, listDto } from './commentReply.dto';
import { EssayCommentReplyService } from './commentReply.service';

@Controller('comment/reply')
export class CommentReplyController {
  constructor(
    private readonly essayCommentReplyService: EssayCommentReplyService,
  ) {}

  // 创建文章评论
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CommentReplyDto, @Request() request) {
    return this.essayCommentReplyService.create(body, request.user);
  }

  // 获取文章评论列表
  // @Get('list')
  // @UseGuards(AuthGuard('jwt'))
  // async getList(@Query() query: listDto) {
  //   const { page, pageSize, commentId } = query;
  //   return this.essayCommentReplyService.getList(page, pageSize, commentId);
  // }
}

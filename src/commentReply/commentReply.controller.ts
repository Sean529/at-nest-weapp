import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CommentReplyDto } from './commentReply.dto';
import { EssayCommentReplyService } from './commentReply.service';

@Controller('comment/reply')
export class CommentReplyController {
  constructor(private readonly essayCommentService: EssayCommentReplyService) {}

  // 创建文章评论
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CommentReplyDto, @Request() request) {
    return this.essayCommentService.create(body, request.user);
  }
}

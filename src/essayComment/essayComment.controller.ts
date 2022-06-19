import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EssayCommentDto } from './essayComment.dto';
import { EssayCommentService } from './essayComment.service';

@Controller('comment')
export class EssayCommentController {
  constructor(private readonly essayCommentService: EssayCommentService) {}

  // 创建文章评论
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: EssayCommentDto, @Request() request) {
    return this.essayCommentService.create(body, request.user);
  }
}

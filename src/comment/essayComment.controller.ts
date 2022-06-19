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
import { EssayCommentDto, listDto } from './essayComment.dto';
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

  // 获取文章评论列表
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  async getList(@Query() query: listDto) {
    const { page, pageSize, essayId } = query;
    return this.essayCommentService.getList(page, pageSize, essayId);
  }
}

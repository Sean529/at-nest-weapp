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

import { EssayService } from './essay.service';
import { EssayDto, listDto } from './essay.dto';

@Controller('essay')
export class EssayController {
  constructor(private readonly essayService: EssayService) {}

  // 创建文章
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: EssayDto, @Request() request) {
    return this.essayService.create(body, request.user);
  }

  // 获取文章列表
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  async getList(@Query() query: listDto) {
    const { page, pageSize } = query;
    return this.essayService.list(page, pageSize);
  }
}

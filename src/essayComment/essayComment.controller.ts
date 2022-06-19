import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EssayCommentService } from './essayComment.service';

@Controller('comment')
export class EssayCommentController {
  constructor(private readonly essayCommentService: EssayCommentService) {}
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body, @Request() request) {
    return this.essayCommentService.create(body, request.user);
  }
}

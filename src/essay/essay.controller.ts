import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EssayService } from './essay.service';
import { EssayDto } from './essay.dto';

@Controller('essay')
export class EssayController {
  constructor(private readonly essayService: EssayService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: EssayDto, @Request() request) {
    return this.essayService.create(body, request.user);
  }
}

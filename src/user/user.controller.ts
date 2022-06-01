import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfoDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

// 配置局部路由
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  async test() {
    return this.userService.test();
  }

  // 更新用户信息
  @Post('updateUserInfo')
  @UseGuards(AuthGuard('jwt'))
  async updateUserInfo(@Body() body: UserInfoDto, @Request() request) {
    return this.userService.updateUserInfo(body, request.user.userId);
  }

  // 获取用户信息
  @Get('getUserInfo')
  @UseGuards(AuthGuard('jwt'))
  async getUserInfo(@Request() request) {
    return this.userService.getUserInfo(request.user.userId);
  }
}

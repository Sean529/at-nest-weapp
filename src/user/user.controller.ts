import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
  @UseGuards(AuthGuard('jwt'))
  @Post('updateUserInfo')
  async updateUserInfo(@Body() body: UserInfoDto) {
    return this.userService.updateUserInfo(body);
  }

  // 获取用户信息
  @UseGuards(AuthGuard('jwt'))
  @Get('getUserInfo')
  async getUserInfo(@Query() query: any) {
    return this.userService.getUserInfo(query.userId);
  }
}

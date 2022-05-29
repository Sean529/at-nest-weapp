import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfoDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

// 配置局部路由
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 查找某一个用户路由
  @Get('findOne')
  async findOne(@Query() query: any) {
    return this.userService.findOne(query.token);
  }

  // login
  @Post('login')
  async login(@Body() body: any) {
    return this.userService.login(body.code);
  }

  // 更新用户信息
  @Post('updateUserInfo')
  async updateUserInfo(@Body() body: UserInfoDto) {
    return this.userService.updateUserInfo(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  async test() {
    return this.userService.test();
  }

  // 获取用户信息
  @UseGuards(AuthGuard('jwt'))
  @Get('getUserInfo')
  async getUserInfo(@Query() query: any) {
    return this.userService.getUserInfo(query.userId);
  }
}

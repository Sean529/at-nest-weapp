// 引入 Nest.js 内置的各个功能
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// 引入用户服务
import { UserService } from './user.service';
// 引入创建用户 DTO 用于限制从接口处传来的参数
import { UserInfoDto } from './user.dto';

// 配置局部路由
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 查找某一个用户路由
  @Get('findOne')
  async findOne(@Query() query: any) {
    return this.userService.findOne(query.token);
  }

  @Get('code2Session')
  async code2Session(@Query() query: any) {
    return this.userService.code2Session(query.code);
  }

  @Post('updateUserInfo')
  async updateUserInfo(@Body() body: UserInfoDto) {
    return this.userService.updateUserInfo(body);
  }

  @Get('getGitee')
  async getGitee() {
    return this.userService.getGitee();
  }

  @Get('test')
  async test() {
    return this.userService.test();
  }
}

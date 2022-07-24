import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('getList')
  async getList() {
    return this.authService.getList();
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.code);
  }
}

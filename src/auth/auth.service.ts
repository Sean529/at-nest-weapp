import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(aaaa: any): Promise<any> {
    const payload = { username: aaaa.username, userId: aaaa.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

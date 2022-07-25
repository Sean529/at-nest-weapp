import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { UserInfo } from '../entity/userInfo.entity';

export class CreateUserEssayDto {
  @IsNotEmpty()
  essayId: number;

  @IsOptional()
  userInfo: UserInfo;

  @IsNotEmpty()
  @MaxLength(300)
  content: string;

  @IsNotEmpty()
  type: number;

  @IsNotEmpty()
  auditStatus: number;

  isDeleted: boolean;
}

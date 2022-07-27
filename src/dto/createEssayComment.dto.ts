import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { UserEssay } from '../entity/userEssay.entity';
import { UserInfo } from '../entity/userInfo.entity';

export class CreateEssayCommentDto {
  @IsNotEmpty()
  commentId: number;

  @IsOptional()
  userInfo: UserInfo;

  @IsOptional()
  essayInfo: UserEssay;

  @IsNotEmpty()
  @MaxLength(300)
  content: string;

  isDeleted: boolean;
}

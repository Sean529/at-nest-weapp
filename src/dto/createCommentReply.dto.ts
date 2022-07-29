import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { UserInfo } from '../entity/userInfo.entity';
import { EssayComment } from '../entity/essayComment.entity';

export class CreateCommentReplyDto {
  @IsNotEmpty()
  replyId: number;

  @IsOptional()
  commentInfo: EssayComment;

  @IsOptional()
  userInfo: UserInfo;

  @IsNotEmpty()
  @MaxLength(300)
  content: string;

  isDeleted: boolean;
}

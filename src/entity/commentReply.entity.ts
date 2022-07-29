import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { UserInfo } from './userInfo.entity';
import { EssayComment } from './essayComment.entity';

/**
 * 评论回复表
 */
@Entity({ name: 'comment_reply' })
export class CommentReply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 评论id
   */
  @Column({
    type: 'bigint', // 大数字
    name: 'replay_id',
    unique: true, // 不重复
    unsigned: true, // unsigned
    comment: '评论回复id',
  })
  replyId: number;

  /**
   * 多个回复对应一个用户
   */
  @ManyToOne(() => UserInfo, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  userInfo: UserInfo;

  /**
   * 多个回复对应一个评论
   */
  @ManyToOne(() => EssayComment, (comment) => comment.commentId)
  @JoinColumn({ name: 'comment_id' })
  commentInfo: EssayComment;

  /**
   * 文字内容
   */
  @Column({
    type: 'varchar',
    comment: '文字内容',
    length: 300,
  })
  content: string;

  /**
   * 是否已删除
   */
  @Column({
    default: false,
    name: 'is_deleted',
    comment: '是否已删除',
  })
  isDeleted: boolean;
}

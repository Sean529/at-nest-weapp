import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { UserInfo } from './userInfo.entity';
import { UserEssay } from './userEssay.entity';

/**
 * 用户信息表
 */
@Entity({ name: 'essay_comment' })
export class EssayComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 评论id
   */
  @Column({
    type: 'bigint', // 大数字
    name: 'comment_id',
    unique: true, // 不重复
    unsigned: true, // unsigned
    comment: '评论id',
  })
  commentId: number;

  /**
   * 多个评论对应一个文章
   */
  @ManyToOne(() => UserEssay, (essay) => essay.essayId)
  @JoinColumn({ name: 'essay_id' })
  essayInfo: UserEssay;

  /**
   * 多个评论对应一个用户
   */
  @ManyToOne(() => UserInfo, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
  userInfo: UserInfo;

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

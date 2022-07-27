import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { UserInfo } from './userInfo.entity';
import { EssayType } from '../essay/essay.type';
import { UserEssay } from './userEssay.entity';

export enum AuditStatus {
  CHECK_PENDING, // 待审核
  PASS, // 审核通过
  REJECT, // 审核拒绝
}

/**
 * 用户信息表
 */
@Entity({ name: 'essayComment' })
export class EssayComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 文章id
   */
  @Column({
    type: 'bigint', // 大数字
    name: 'comment_id',
    unique: true, // 不重复
    unsigned: true, // unsigned
    comment: '文章id',
  })
  commentId: number;

  /**
   * 多个评论对应一个文章
   */
  @ManyToOne(() => UserInfo, (user) => user.userId)
  @JoinColumn({ name: 'user_id' })
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
   * 动态类型, 1:纯文本, 2:图文
   */
  @Column({
    comment: '动态类型, 1:纯文本, 2:图文',
    type: 'enum',
    enum: EssayType,
    default: EssayType.TEXT,
  })
  type: number;

  /**
   * 审核状态,0:待审核,1:通过,2:拒绝
   */
  @Column({
    type: 'enum',
    enum: AuditStatus,
    default: AuditStatus.CHECK_PENDING,
    name: 'audit_status',
    comment: '审核状态,0:待审核,1:通过,2:拒绝',
  })
  auditStatus: number;

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

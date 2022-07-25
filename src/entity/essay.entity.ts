import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { UserInfo } from './userInfo.entity';

export enum AuditStatus {
  CHECK_PENDING, // 待审核
  PASS, // 审核通过
  REJECT, // 审核拒绝
}

/**
 * 用户信息表
 */
@Entity({ name: 'user_info' })
export class Essay extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  essayId: string;

  @ManyToOne(() => UserInfo, (userInfo) => userInfo.userId)
  userInfo: UserInfo;

  @Column({
    comment: '文字内容',
  })
  content: string;

  @Column({
    comment: '动态类型, 1:纯文本, 2:图文',
    default: 1,
  })
  type: number;

  @Column({
    enum: AuditStatus,
    default: AuditStatus.CHECK_PENDING,
    comment: '审核状态,0:待审核,1:通过,2:拒绝',
  })
  auditStatus: number;

  @Column({
    default: false,
    comment: '是否已删除',
  })
  isDeleted: boolean;
}

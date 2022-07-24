import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './BaseEntity';

export enum Gender {
  UNKNOWN,
  MALE,
  FEMALE,
}

/**
 * 用户信息表
 */
@Entity({ name: 'user_info' })
export class UserInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint', // 大数字
    name: 'user_id',
    unique: true, // 不重复
    unsigned: true, // unsigned
    comment: '用户编号',
  })
  userId: number;

  @Column({
    type: 'varchar',
    unique: true,
    name: 'open_id',
    comment: '微信openId',
    length: 28,
  })
  openId: string;

  @Column({ comment: '昵称', nullable: true, length: 64 })
  nickname: string;

  @Column({
    comment: '头像',
    nullable: true,
    length: 256,
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNKNOWN,
    comment: '性别,0:未知;1:男;2:女',
  })
  gender: number;
}

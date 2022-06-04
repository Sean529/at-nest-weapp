import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// @Prop 装饰器接受一个可选的参数，通过这个，你可以指示这个属性是否是必须的，是否需要默认值，或者是标记它作为一个常量，下面是例子
// SchemaFactory 是 mongoose 内置的一个方法做用是读取模式文档 并创建 Schema 对象
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    description: '用户ID',
  })
  userId: string;

  @Prop({
    required: true,
    description: '微信openId',
  })
  openId: string;

  @Prop({
    description: '昵称',
    default: '',
    trim: true,
  })
  nickname: string;

  @Prop({
    description: '头像',
    default: '',
    trim: true,
  })
  avatar: string;

  @Prop({
    description: '性别',
    default: 0,
  })
  gender: number; // 0 1 2

  @Prop({
    description: '创建时间',
    default: Date.now(),
  })
  createTime: number;

  @Prop({
    description: '更新时间',
    default: Date.now(),
  })
  updateTime: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

export const UserConfig = {
  collection: 'user',
  name: 'User',
};

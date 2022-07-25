import { Base } from '../type/base.type';

export enum EssayType {
  TEXT, // 仅文字
  IMAGE, // 包含文字、图片
}

export interface IUserEssay extends Base {
  essayId: number;
  content: string;
  type: EssayType;
  auditStatus?: number; // 待审核
  isDeleted?: boolean;
}

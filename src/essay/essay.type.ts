export enum EssayType {
  text, // 仅文字
  image, // 包含文字、图片
}

export interface IUserEssay {
  essayId: string;
  userId: string;
  content: string;
  type: EssayType;
  auditStatus?: number; // 待审核
  isDelete?: boolean;
  deleteTime?: number | null;
  createTime?: number;
  updateTime?: number;
}

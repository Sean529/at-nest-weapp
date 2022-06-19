export class EssayDto {
  essayId?: string;
  userId?: string; // 发表人
  content: string; // 文字内容
  type?: number; // 0 仅文字，1图文
  auditStatus?: number; // 审核状态 0 待审核 1 审核通过 2 审核不通过
  isDeleted?: boolean; // 文章是否被删除
  deleteTime?: number | null; // 删除时间
  createTime?: number;
  updateTime?: number;
}

export class listDto {
  page?: number;
  pageSize?: number;
}

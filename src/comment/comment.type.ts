export interface IEssayComment {
  commentId: string; // 评论id
  userId: string; //评论人用户id
  essayId: string; // 被评论动态id
  content: string; // 评论文字内容
  likes: number; //点赞数量
  replyNum: number; // 回复数量
  isDeleted: boolean; // 是否已删除
  createTime: number; // 评论时间
  deleteTime: number | null; // 删除时间
}
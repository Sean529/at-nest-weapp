export interface IEssayComment {
  commentId: number; // 评论id
  userId: number; //评论人用户id
  essayId: number; // 被评论动态id
  content: string; // 评论文字内容
  likes?: number; //点赞数量
  replyNum?: number; // 回复数量
  isDeleted: boolean; // 是否已删除
}

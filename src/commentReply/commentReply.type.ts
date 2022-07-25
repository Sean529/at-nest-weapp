export interface ICommentReply {
  replyId: string; // 回复id
  essayId: string; // 动态id
  commentId: number; // 评论id
  userId: string; // 回复人用户id
  parentReplyId: string | null; // 父回复id。回复别人对评论的回复，别人的回复就是父回复
  parentReplyUserId: string | null; // 父回复的用户id
  content: string; // 回复内容
  likes: number; // 点赞数量
  createTime: number; // 回复时间
  deleteTime: number | null; // 删除时间
  isDeleted: boolean; // 是否删除
}

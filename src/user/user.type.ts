export interface IUser {
  userId: string;
  openId: string;
  nickname?: string;
  avatar?: string;
  gender?: number; // 0 1 2
  createTime?: number;
  updateTime?: number;
}

export class CreateUserDto {
  readonly nickname: string;
  readonly gender: number;
  readonly avatar: string;
}

export class UserInfoDto {
  readonly nickname?: string;
  readonly gender?: number;
  readonly avatar?: string;
  readonly openId: string;
  readonly userId?: string;
  readonly createTime?: number;
  readonly updateTime?: number;
}

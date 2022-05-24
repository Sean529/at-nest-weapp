export class CreateUserDto {
  readonly nickname: string;
  readonly gender: number;
  readonly avatar: string;
}

export class CreateUserInfoDto {
  readonly nickname?: string;
  readonly gender?: number;
  readonly avatar?: string;
  readonly openId: string;
  readonly createTime?: number;
  readonly updateTime?: number;
}

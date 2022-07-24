import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CacheService {
  public client;
  constructor(private redisService: RedisService) {
    this.getClient();
  }

  async getClient() {
    // 获取 Redis 客户端
    this.client = await this.redisService.getClient();
  }

  // 设置值，失效时间单位是毫秒
  async set(key: string | number, value: any, time?: number) {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (!time) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', time);
    }
  }

  // 获取值
  async get(key: string) {
    if (!this.client) {
      await this.getClient();
    }
    const data = await this.client.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }
}

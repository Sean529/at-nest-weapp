import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';

import { CacheService } from './cache.service';
import { options } from '../config/db';

@Module({
  imports: [RedisModule.register(options)],
  controllers: [],
  providers: [CacheService],
})
export class CacheModule {}

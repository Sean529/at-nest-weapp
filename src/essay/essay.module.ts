import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';

import { EssayController } from './essay.controller';
import { EssayService } from './essay.service';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [HttpModule, CacheModule],
  controllers: [EssayController],
  providers: [EssayService, CacheService],
})
export class EssayModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from 'nestjs-http-promise';

import { EssayController } from './essay.controller';
import { EssayService } from './essay.service';
import { UserEssaySchema, UserEssayConfig } from '../schema/essay.schema';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    MongooseModule.forFeature([
      {
        collection: UserEssayConfig.collection,
        name: UserEssayConfig.name,
        schema: UserEssaySchema,
      },
    ]),
  ],
  controllers: [EssayController],
  providers: [EssayService, CacheService],
})
export class EssayModule {}

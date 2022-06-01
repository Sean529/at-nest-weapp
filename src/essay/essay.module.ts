import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from 'nestjs-http-promise';

import { EssayController } from './essay.controller';
import { EssayService } from './essay.service';
import { EssaySchema } from '../schema/essay.schema';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    MongooseModule.forFeature([
      { collection: 'essay', name: 'Essay', schema: EssaySchema },
    ]),
  ],
  controllers: [EssayController],
  providers: [EssayService, CacheService],
})
export class EssayModule {}

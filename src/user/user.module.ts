import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user.schema';
import { HttpModule } from 'nestjs-http-promise';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { collection: 'user', name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

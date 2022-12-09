import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EFriend } from './interface/friend.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([EFriend]), UsersModule],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}

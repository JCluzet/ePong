import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { GameHistoryController } from './gameHistory.controller';
import { GameHistoryService } from './gameHistory.service';
import { EGameHistory } from './interface/gameHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EGameHistory, EUser])],
  controllers: [GameHistoryController],
  providers: [GameHistoryService, UsersService],
  exports: [GameHistoryService],
})
export class GameHistoryModule {}

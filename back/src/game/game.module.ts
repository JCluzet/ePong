import { Module } from '@nestjs/common';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { GameGateway } from './game.gateway';
import { GameHistoryModule } from 'src/gameHistory/gameHistory.module';
import { UsersModule } from 'src/users/users.module';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';
;

@Module({
    imports: [ScheduleModule.forRoot() ,GameHistoryModule, UsersModule],
    controllers: [GameController],
    providers: [GameService, GameGateway, PongService],
    exports: [GameService]
})
export class GameModule {}

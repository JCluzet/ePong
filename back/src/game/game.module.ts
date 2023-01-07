import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { EGame } from 'src/game/entity/game.entity'
import { GameGateway } from './game.gateway';
import { UsersService } from '../users/users.service';
import { EUser } from 'src/users/interfaces/user.entity'
import { GameHistoryModule } from 'src/gameHistory/gameHistory.module';

@Module({
    imports: [TypeOrmModule.forFeature([EGame, EUser]), GameHistoryModule],
    controllers: [GameController],
    providers: [GameService, GameGateway, UsersService, Repository<EUser>],
    exports: [GameService]
})
export class GameModule { }

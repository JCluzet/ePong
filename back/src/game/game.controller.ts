import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { AuthGuard } from '@nestjs/passport';
import { IRoom } from './interface/room.interface';

@ApiTags('Games')
@Controller('api/game')
export class GameController {
    constructor(
        private readonly gameService: GameService
    ) { }

    @Get('/:name')
    @UseGuards(AuthGuard('jwt'))
    async getRoomFromUser(@Param('name') name: string): Promise<string> {
        return await this.gameService.getRoomFromUser(name);
    }

    @Get('/getRoom')
    @UseGuards(AuthGuard('jwt'))
    async getRoom(): Promise<IRoom[]> {
        return await this.gameService.getAllRoom();
    }

}

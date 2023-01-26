import { ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GameService } from 'src/game/game.service';
import { AuthGuard } from '@nestjs/passport';

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
}

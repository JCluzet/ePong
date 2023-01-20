import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt.strategy';
import { GameService } from 'src/game/game.service';

@ApiTags('Games')
@Controller('api/game')
export class GameController {
    constructor(
        private readonly gameService: GameService
    ) { }


    // @ApiOperation({ summary: 'Returns game history specific user [jwt-protected]' })
    // @UseGuards(JwtAuthenticationGuard)
    // @Get(':login/history')
    // getGames(@Param('login') login: string, @Request() req) {
    //     return this.gameService.getGames(login);
    // }
}

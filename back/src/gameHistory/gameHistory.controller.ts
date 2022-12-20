import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { GameHistoryService } from './gameHistory.service';
import { gameHistoryDto } from './interface/gameHistory.dto';
import { EGameHistory } from './interface/gameHistory.entity';

@Controller('game-history')
export class GameHistoryController {
  constructor(private gameHistoryService: GameHistoryService, private usersService: UsersService) {}

  @Get('/history')
  @UseGuards(AuthGuard('jwt'))
  async getAllHistory(): Promise<EGameHistory[] | undefined> {
    try {
      const allHistory: EGameHistory[] | undefined = await this.gameHistoryService.getAllGameHistory();
      if (!allHistory) return [];
      return allHistory;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('/history/:login')
  @UseGuards(AuthGuard('jwt'))
  async getGameHistoryByLogin(@Param('login') login: string): Promise<EGameHistory[] | undefined> {
    try {
      const user: EUser | undefined = await this.usersService.findUserByLogin(login);
      if (!user) throw new BadRequestException(`User not found`);
      return await this.gameHistoryService.getGamehistoryByUser(login);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('/newGame')
  @UseGuards(AuthGuard('jwt'))
  async postNewGame(@Body() game: gameHistoryDto) {
    try {
      let users: EUser | undefined = await this.usersService.findUserByLogin(game.winner);
      if (!users) throw new BadRequestException(`User ${game.winner} not found`);
      users = await this.usersService.findUserByLogin(game.loser);
      if (!users) throw new BadRequestException(`User ${game.loser} not found`);
      return await this.gameHistoryService.createNewGame(game);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}

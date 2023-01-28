import { BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { gameHistoryDto } from './interface/gameHistory.dto';
import { EGameHistory } from './interface/gameHistory.entity';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(EGameHistory)
    private gameHistoryRepository: Repository<EGameHistory>,
    private userService: UsersService,
  ) {}

  async getAllGameHistory(): Promise<EGameHistory[]> {
    try {
      return await this.gameHistoryRepository.find();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getGamehistoryByUser(login: string): Promise<EGameHistory[] | undefined> {
    try {
      let history: EGameHistory[] = await this.gameHistoryRepository.createQueryBuilder('gameHistory').where({ winner: login }).orWhere({ loser: login }).getMany();
      for (const his of history) {
        const player1: EUser =  await this.userService.findUserByLogin(his.winner);
        const player2: EUser =  await this.userService.findUserByLogin(his.loser);
        his.winner = player1.name;
        his.loser = player2.name;
      }
      return history;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async createNewGame(game: gameHistoryDto) {
    try {
      const newGame: EGameHistory = {
        winner: game.winner,
        loser: game.loser,
        winnerScore: game.winnerScore,
        loserScore: game.loserScore,
        type: game.type,
        timeStamp: game.timeStamp,
      };
      await this.gameHistoryRepository.save(newGame);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async removeAll(): Promise<boolean> {
    try {
      const ids = (await this.getAllGameHistory()).map((element) => element.id);
      if (ids.length) this.gameHistoryRepository.delete(ids);
      return true;
    } catch (err) {
      return false;
    }
  }
}

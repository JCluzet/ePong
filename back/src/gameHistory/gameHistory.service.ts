import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { gameHistoryDto } from './interface/gameHistory.dto';
import { EGameHistory } from './interface/gameHistory.entity';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(EGameHistory)
    private gameHistoryRepository: Repository<EGameHistory>,
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
      return await this.gameHistoryRepository.createQueryBuilder('gameHistory').where({ winner: login }).orWhere({ loser: login }).getMany();
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
        timeStamp: game.timeStamp,
      };
      await this.gameHistoryRepository.save(newGame);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      Logger.log(`gameHistory db removed`);
      return true;
    } catch (err) {
      Logger.log(`Error: gameHistory db remove failled.`);
      return false;
    }
  }
}

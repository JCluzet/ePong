import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EGame } from 'src/game/entity/game.entity';
import { UsersService } from '../users/users.service';
import { EUser } from 'src/users/interfaces/user.entity'
import { GameHistoryService } from 'src/gameHistory/gameHistory.service';


@Injectable()
export class GameService {
	constructor(
		@InjectRepository(EGame)
		private gameRepository: Repository<EGame>,
		@InjectRepository(EUser)
		private userRepository: Repository<EUser>,
		private userService: UsersService,
		private gameHistoricService: GameHistoryService,
	) { }

	getAllGames() {
		return this.gameRepository.find();
	}

	async createGame(winner_login: number, loser_login: number, winner_points: number, loser_points: number, gm: number) {
		const winner = await this.userService.findUserById(winner_login);
		const loser = await this.userService.findUserById(loser_login);

		await this.userService.updateStatus(winner.login, "online");
		await this.userService.updateStatus(loser.login, "online");
		await this.userService.editGameScore({winner: winner.login, loser: loser.login});
		await this.gameHistoricService.createNewGame({winner: winner.login, loser: loser.login, winnerScore: winner_points, loserScore: loser_points, timeStamp: new Date().toJSON().slice(0, 10)})
		if (winner && loser) {
			const newGame : EGame = {
				winner: winner_login,
				loser: loser_login,
				winner_score: winner_points,
				loser_score: loser_points,
				game_mode: gm,
				// players: [winner, loser]
			};
			await this.gameRepository.save(newGame);

			return newGame;
		}
		else
			return;
	}

	// async getGames(login: string) {
	// 	const user = await this.userRepository.findOne({
	// 		relations: ['games'],
	// 		where: { login: login }
	// 	});
	// 	return user.games.reverse();
	// }

	async removeAll(): Promise<boolean> {
		try {
		const ids = (await this.getAllGames()).map((element) => element.id);
		if (ids.length) this.gameRepository.delete(ids);
		Logger.log(`game db removed`);
		return true;
		} catch (err) {
		Logger.log(`Error: game db remove failled.`);
		return false;
		}
	}
}

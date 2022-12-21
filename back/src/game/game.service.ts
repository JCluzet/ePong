import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/game/entity/game.entity';
import { UsersService } from '../users/users.service';
import { EUser } from 'src/users/interfaces/user.entity'


@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private gameRepository: Repository<Game>,
		@InjectRepository(EUser)
		private userRepository: Repository<EUser>,
		private userService: UsersService,
	) { }

	getAllGames() {
		return this.gameRepository.find();
	}

	async updateStats(user: EUser, hasWon: boolean) {
		hasWon ? user.nbWins += 1 : user.nbLoses += 1;
		user.total_games += 1;
		user.win_loss_ratio = (user.nbWins) / (user.total_games) * 100;
		await this.userRepository.save(user);
	}

	async createGame(winner_login: number, loser_login: number, winner_points: number, loser_points: number, gm: number) {
		const winner = await this.userService.findUserById(winner_login);
		const loser = await this.userService.findUserById(loser_login);

		await this.updateStats(winner, true);
		await this.updateStats(loser, false);

		if (winner && loser) {
			const newGame = await this.gameRepository.create({
				winner: winner_login,
				loser: loser_login,
				winner_score: winner_points,
				loser_score: loser_points,
				game_mode: gm,
				// players: [winner, loser]
			});
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
}

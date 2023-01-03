import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EGame } from 'src/game/entity/game.entity';
import { UsersService } from '../users/users.service';
import { EUser } from 'src/users/interfaces/user.entity'


@Injectable()
export class GameService {
	constructor(
		@InjectRepository(EGame)
		private gameRepository: Repository<EGame>,
		@InjectRepository(EUser)
		private userRepository: Repository<EUser>,
		private userService: UsersService,
	) { }

	getAllGames() {
		return this.gameRepository.find();
	}

	async createGame(winner_login: number, loser_login: number, winner_points: number, loser_points: number, gm: number) {
		const winner = await this.userService.findUserById(winner_login);
		const loser = await this.userService.findUserById(loser_login);

		Logger.log(`check after find user`);
		await this.userService.editGameScore({winner: winner.login, loser: loser.login});
		Logger.log(`check after editGameScore`);
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
}

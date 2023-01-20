import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GameHistoryService } from 'src/gameHistory/gameHistory.service';
import { IRoom } from './interface/room.interface';
import { IOptionGame, ICursor } from './interface/GameOption.interface';
import { Socket } from 'socket.io';
import { IPlayer } from './interface/player.interface';
import { gameHistoryDto } from 'src/gameHistory/interface/gameHistory.dto';
import { Interval } from '@nestjs/schedule';


@Injectable()
export class GameService {
	constructor(
		private userService: UsersService,
		private gameHistoricService: GameHistoryService,
	) { }

	rooms: Map<string, IRoom> = new Map();
	queue: Array<Socket> = [];

	static cursor: ICursor = {
		x: 10,
		y: 80,
	}

	static optionGame: IOptionGame = {
		classic: {
			optionName: "classic",
			ball: {
				x: 10,
				y: 10,
				ballspeed: 2,
				position: {
					x: 0,
					y: 0,
				}
			},
			cursor: GameService.cursor,
		},
		bigBall: {
			optionName: "bigBall",
			ball: {
				x: 50,
				y: 50,
				ballspeed: 2,
				position: {
					x: 0,
					y: 0,
				} 
			},
			cursor: GameService.cursor,
		},
		fast: {
			optionName: "fast",
			ball: {
				x: 10,
				y: 10,
				ballspeed: 5,
				position: {
					x: 0,
					y: 0,
				} 
			},
			cursor: GameService.cursor,
		}
	};
	
	createRoomGame(roomId: string = null): IRoom {
		while (!roomId) {
			const newId = Math.floor(Math.random() * Math.pow(16, 10)).toString(16);
			if (!this.rooms.has(newId)) roomId = newId;
		}
		const newRoom: IRoom = {
			id: roomId,
			player: [],
			spectator: [],
			GameOption: null,
			score: { player1: 0, player2 : 0 },
			gameIsStart: false,
		}
		this.rooms.set(roomId, newRoom);
		return newRoom;
	}

	async removeSocket(socket: Socket) {
		if (this.queue.indexOf(socket) != -1)
			return this.queue.splice(this.queue.indexOf(socket), 1);
		for (const room of this.rooms.values()) {
			if (room.spectator && room.spectator.indexOf(socket) != -1)
				return room.spectator.splice(room.spectator.indexOf(socket), 1)
			for (const player of room.player)
				if (player.socket.id == socket.id){
					this.stopGame(room, player);
					room.player.splice(room.player.indexOf(player), 1);
					break;
				}
			if (!room.player.length) return this.rooms.delete(room.id);
		}
	}

	addQueue(socket: Socket): boolean {
		try {
			for (const qSocket of this.queue)
				if (qSocket.data.user.id == socket.data.user.id) return false;
			if (this.getPlayer(socket)) return false;
			this.queue.push(socket);
			if (this.queue.length > 2) {
				const room: IRoom = this.createRoomGame();
				while(this.queue.length && room.player.length < 2){
					const newplayer: IPlayer = {
						socket: socket,
						user: socket.data.user,
						score: 0,
						gameMode: socket.data.gameMode,
						room: room,
						position: {x: 0, y: 0},
					}
					this.playerJoinRoom(newplayer, room);
					this.queue.shift();
				}
				if (room.player.length == 2) room.gameIsStart = true;
			}
			return true;


		} catch (err) { return false; }
	}


	playerJoinRoom(player: IPlayer, room: IRoom): boolean {
		try {
			if (!room.gameIsStart) {
				room.player.push(player);
				if (room.player.length == 2) room.gameIsStart = true;
				return true;
			}
			return false;
		} catch (err) { return false; }
	}

	spectateJoinRoom(spactate: Socket, room: IRoom): boolean {
		try {
			room.spectator.push(spactate);
			return true;
		} catch (err) { return false; }
	}

	getPlayer(socket: Socket): IPlayer | undefined {
		for (const room of this.rooms.values())
			for (const player of room.player)
				if (player.socket == socket) return player;
		return undefined;
	}

	getRoom(id: string): IRoom {
		return this.rooms.get(id);
	}

	startGame(room: IRoom) {
		if (!room.gameIsStart) return;
		for (const player of room.player) if (!player.gameMode) return;
		for (const player of room.player) this.userService.updateStatus(player.user.login, "ingame");

		const option = room.player[Math.round(Math.random())].gameMode;
		if (option === "classic" ) room.GameOption = GameService.optionGame.classic;
		else if (option === "bigBall") room.GameOption = GameService.optionGame.bigBall;
		else room.GameOption = GameService.optionGame.fast;
		this.emit(room, "startGame", room.GameOption, room.player.map((player) => player.user));
	}

	stopGame(room: IRoom, playerDisconnected: IPlayer | undefined) {
		var winner: IPlayer;
		var looser: IPlayer;
		room.gameIsStart = false;
		if (playerDisconnected){
			for (const player of room.player){
				if (player === playerDisconnected) looser = player;
				else winner = player;
			}
			const newhistory: gameHistoryDto = {
				winner: winner.user.login,
				loser: looser.user.login,
				winnerScore: winner.score,
				loserScore: looser.score,
				timeStamp: new Date().toJSON().slice(0, 10),
				type: room.GameOption.optionName,
			};
			this.gameHistoricService.createNewGame(newhistory);
		} else {
			for(const player of room.player) {
				if (player.score === 5) winner = player;
				else looser = player;
			}
			const newhistory: gameHistoryDto = {
				winner: winner.user.login,
				loser: looser.user.login,
				winnerScore: winner.score,
				loserScore: looser.score,
				timeStamp: new Date().toJSON().slice(0, 10),
				type: room.GameOption.optionName,
			};
			this.gameHistoricService.createNewGame(newhistory);
		}
		this.emit(room, "stopGame", winner.user);
	}

	@Interval(1000 / 60)
	loop() {
		for (const room of this.rooms.values())
			if (room.gameIsStart) Logger.log("Loop game update");
	}

	emit(room: IRoom, event: string, ...args: any) {
		for (const player of room.player) player.socket.emit(event, ...args);
		if (room.spectator)
			for(const spec of room.spectator) spec.emit(event, ...args);
	}

}

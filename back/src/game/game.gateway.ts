import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from "@nestjs/common";
import { GameService } from './game.service';
import { UsersService } from '../users/users.service';

let MatchMaking = [[], [], [], [], []];
let vs1 = [];
let vs2 = [];

@WebSocketGateway({ namespace: 'game', cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("GameGateway");

	constructor(
		private readonly gameService: GameService,
		private readonly userService: UsersService
	) { Logger.log(`test connection`);}

	afterInit(server: Server) {
		this.logger.log("game socket init !");
	}

	async handleConnection(socket: Socket, ...args: any[]) {
	}

	async handleDisconnect(socket: Socket, ...args: any[]) {
	}

	@SubscribeMessage('search')
	async messageMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		Logger.log(`check search game`);
		let gameMode = 0;
		let isSearching = true
		if (body.includes("bigball"))
			gameMode = 1;
		else if (body.includes("blitz"))
			gameMode = 2;
		else if (body.includes("cube"))
			gameMode = 3;
		if (body.includes("STOPSEARCH"))
			isSearching = false;

		if (socket.handshake.query.username && isSearching) {
			MatchMaking[gameMode].push(socket.handshake.query.username);
		} else if (socket.handshake.query.username && !isSearching) {
			const index = MatchMaking[gameMode].indexOf(socket.handshake.query.username);
			if (index > -1) {
				MatchMaking[gameMode].splice(index, 1);
			}
		}

		if (socket.handshake.query.username && MatchMaking[gameMode].length >= 2) {
			var index = MatchMaking[gameMode].indexOf(socket.handshake.query.username);
			if (index > -1) {
				MatchMaking[gameMode].splice(index, 1);
			}
			let adversaire = MatchMaking[gameMode][0];
			index = MatchMaking[gameMode].indexOf(adversaire);
			if (index > -1) {
				MatchMaking[gameMode].splice(index, 1);
			}
			await this.userService.updateStatus(String(socket.handshake.query.username), "ingame");
			await this.userService.updateStatus(String(adversaire), "ingame");
			this.server.emit('gameStart', socket.handshake.query.username, adversaire, gameMode);
		}
	}

	@SubscribeMessage('versus')
	async versusMatch(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b = body.split(':');
		var index1 = vs1.indexOf(b[0]);
		var index2 = vs2.indexOf(b[1]);
		if (index1 > -1 && index2 > -1) {
			vs1.splice(index1, 1);
			vs2.splice(index1, 1);
			this.server.emit('gameStart', b[0], b[1], 0);
			return;
		}
		// index1 = vs1.indexOf(b[1]);
		// index2 = vs2.indexOf(b[0]);
		// if (index1 > -1 && index2 > -1) {
		// 	vs1.splice(index1, 1);
		// 	vs2.splice(index1, 1);
		// 	this.server.emit('gameStart', b[1], b[0], 0);
		// 	return;
		// }
		vs1.push(b[1]);
		vs2.push(b[0]);
		this.server.emit('inviteToPlay', b[0], b[1]);

	}

	@SubscribeMessage('removeInvit')
	async removeInvit(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		var index = vs1.indexOf(socket.handshake.query.username);
		if (index > -1) {
			vs1.splice(index, 1);
			vs2.splice(index, 1);
		}
		index = vs2.indexOf(socket.handshake.query.username);
		if (index > -1) {
			vs1.splice(index, 1);
			vs2.splice(index, 1);
		}
	}

	@SubscribeMessage('gameEnd')
	async gameEnd(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b = body.split(':');
		if (b[0] && b[1]) {
			let winner = await this.userService.findUserByLogin(b[0]);
			let looser = await this.userService.findUserByLogin(b[1]);
			this.gameService.createGame(winner.id, looser.id, Number(b[2]), Number(b[3]), Number(b[4]));
			this.server.emit('stopGame', b[0], b[1]);
			//this.userService.updateStatus(String(b[0]), "online");
			//this.userService.updateStatus(String(b[1]), "online");
		}

	}

	@SubscribeMessage('playerMove')
	async playerMove(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b = body.split(':');
		this.server.emit('playerMove', body);
	}

	@SubscribeMessage('roundStart')
	async roundStart(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b = body.split(':');
		this.server.emit('roundStartLIVE', body);
	}

	@SubscribeMessage('ballMoveFront')
	async ballMoveEmit(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		// const b = body.split(':');
		this.server.emit('ballMoveBack', body);
	}


}
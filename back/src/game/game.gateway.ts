import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { GameService } from './game.service';
import { IPlayer } from './interface/player.interface';
import { IRoom } from './interface/room.interface';
import { PongService } from './pong.service';

@WebSocketGateway({ namespace: 'game', cors: true })
export class GameGateway {
	constructor( 
		private readonly userService: UsersService,
		private readonly gameService: GameService,
		private readonly pongService: PongService,
	 ) {}
	@WebSocketServer()
	server: any;

	async handleConnection(client: Socket): Promise<any> {
			try {
				const user: EUser = await this.userService.findUserByLogin(String(client.handshake.query.login));
				if (!user) client.disconnect();
				client.data.user = user;
			} catch (err) {}
	}

	async handleDisconnect(client: Socket): Promise<any> {
		try {
			if (!client.data.user) return;
			await this.gameService.removeSocket(client);
			this.userService.updateStatus(client.data.user.login, "online");
		} catch (err) {}
	}

	@SubscribeMessage('queue')
	joinQueue(client: Socket, gameMode: String) {
		try {
			if (!client.data.user) return;
			client.data.gameMode = gameMode;
			this.gameService.addQueue(client);
		} catch (err) {}
	}

	@SubscribeMessage('leaveQueue')
	async leaveQueue(client: Socket) {
		try {
			if (!client.data.user) return;
			await this.gameService.removeSocket(client);
			this.userService.updateStatus(client.data.user.login, "online");
		} catch (err) {}
	}

	@SubscribeMessage('room')
	joinRoom(client: Socket, id?: string) {
		try {
			if (!client.data.user) return;
			let room: IRoom = this.gameService.getRoom(id);
			if (!room) room = this.gameService.createRoomGame();
			this.gameService.spectateJoinRoom(client, room);
			client.emit("spectateJoin", {player1: room.player[0].user.name, player2: room.player[1].user.name})
		} catch (err) {}
	}

	@SubscribeMessage('vs')
	async joinVs(client: Socket, name: string[]){
		try {
			if (!client.data.user) return;
			this.gameService.addVsQueue(client, name);
		} catch (err) {}
	}

	@SubscribeMessage('start')
	onStart(client: Socket) {
		try {
			if (!client.data.user) return;
			const player: IPlayer = this.gameService.getPlayer(client.data.user.id);
			if (!player || !player.room) return;
			this.pongService.resetBall(player.room);
		} catch (err) {}
	}

	@SubscribeMessage('cursor')
	updateCursor(client: Socket, y: number) {
		try {
			if (!client.data.user) return;
			const player: IPlayer = this.gameService.getPlayer(client.data.user.id);
			if (!player) return;
			player.position.y = y;
		} catch (err) {}
	}
}
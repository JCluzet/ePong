import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EUser } from 'src/users/interfaces/user.entity';
import { UsersService } from 'src/users/users.service';
import { GameService } from './game.service';
import { IRoom } from './interface/room.interface';

@WebSocketGateway({ namespace: 'game', cors: true })
export class GameGateway {
	constructor( private readonly userService: UsersService, private readonly gameService: GameService ) {}
	@WebSocketServer()
	server: any;

	async handleConnection(client: Socket): Promise<any> {
			try {
				const user: EUser = await this.userService.findUserByLogin(String(client.handshake.query.login));
				if (!user && !String(client.handshake.query.gameMode)) client.disconnect();
				client.data.user = user;
				client.data.gameMode = String(client.handshake.query.login);
				// this.userService.updateStatus(client.data.user.login, "ingame");
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
	joinQueue(client: Socket) {
		try {
			if (!client.data.user) return;
			this.gameService.addQueue(client);
			this.userService.updateStatus(client.data.user.login, "ingame");
		} catch (err) {}
	}

	@SubscribeMessage('room')
	joinRoom(client: Socket, id?: string) {
		try {
			if (!client.data.user) return;
			let room: IRoom = this.gameService.getRoom(id);
			if (!room) room = this.gameService.createRoomGame();

			this.gameService.spectateJoinRoom(client, room);
		} catch (err) {}
	}

	@SubscribeMessage('start')
	onStart(client: Socket) {
		
	}
}
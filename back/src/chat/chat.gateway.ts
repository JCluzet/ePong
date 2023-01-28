import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'ws';

@WebSocketGateway({cors: 'http://localhost:5001/social/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    console.log('Chat Websocket initialized');
  }

  @SubscribeMessage('message')
  messageHandler(client: Socket, message: any) {
    const ret = JSON.parse(JSON.stringify(message));
    this.server.emit('message', { chanId: ret.chanId, senderId: ret.senderId, content: ret.content, timestamp: ret.timestamp });
  }

  handleConnection(client: Socket, ...args: any[]) {
  }

  handleDisconnect(client: Socket) {}
}

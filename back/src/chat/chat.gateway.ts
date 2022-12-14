import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server} from "ws";

@WebSocketGateway(8000, {cors: "http://localhost:3001/social/chat"})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway')

    afterInit(server: Server) {
        console.log("Chat Websocket initialized")
    };

    @SubscribeMessage('message')
    messageHandler(client: Socket, message: any) {
        const ret = JSON.parse(JSON.stringify(message));
        this.server.emit("message", {chanId: ret.chanId, senderId: ret.senderId, content: ret.content, timestamp: ret.timestamp});
    }

    handleConnection(client: Socket, ...args: any[]) {
    }

    handleDisconnect(client: Socket) {
    }
}
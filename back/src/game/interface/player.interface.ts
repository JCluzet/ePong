import { Socket } from "socket.io";
import { EUser } from "src/users/interfaces/user.entity";
import { IPosition } from "./GameOption.interface";
import { IRoom } from "./room.interface";

export type TGM = "classic" | "bigBall" | "fast";

export interface IPlayer {
  socket: Socket;
  user: EUser;
  score: number;
  gameMode: TGM;
  room: IRoom;
  position: IPosition;
}
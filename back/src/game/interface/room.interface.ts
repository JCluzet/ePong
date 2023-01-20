
import { Socket } from "socket.io";
import { IGameOption, IScore } from "./GameOption.interface";
import { IPlayer } from "./player.interface";

export interface IRoom {
	id: string;
  player: Array<IPlayer>;
  spectator?: Array<Socket>
  GameOption: IGameOption;
  score: IScore;
  gameIsStart: boolean;
}
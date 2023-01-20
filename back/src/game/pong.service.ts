import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GameService } from "./game.service";

@Injectable()
export class PongService {
  constructor(@Inject(forwardRef(() => GameService)) private gameService: GameService) {}
}
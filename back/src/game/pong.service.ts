import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GameService } from "./game.service";
import { IPosition } from "./interface/GameOption.interface";
import { IRoom } from "./interface/room.interface";

@Injectable()
export class PongService {
  constructor(@Inject(forwardRef(() => GameService)) private gameService: GameService) {}

  static option = {
    display: { width: 500, height: 400 },
  }

  static velocity = (speed: number, radian: number): IPosition => {
    return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
  }

  updateBall(x: number, y: number, radian: number, room: IRoom): void {
    room.GameOption.ball.position.x = x;
    room.GameOption.ball.position.y = y;
    room.GameOption.ball.velocity = PongService.velocity((room.GameOption.ball.ballspeed *= 1.2), radian);
    this.gameService.emit(room, "updateBall", room.GameOption.ball.position, {player1: room.player[0].position.y, player2: room.player[1].position.y});
  }

  resetBall(room: IRoom, left?: boolean): void {
    let radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    if (left) radian += Math.PI;
    room.GameOption.ball.ballspeed = room.GameOption.ball.speedConst;
    this.updateBall(PongService.option.display.width / 2, PongService.option.display.height / 2, radian, room);
  }

  update(room: IRoom): any {
    const next = {
      x: room.GameOption.ball.position.x + room.GameOption.ball.velocity.x,
      y: room.GameOption.ball.position.y + room.GameOption.ball.velocity.y,
    }
    const ballSide = room.GameOption.ball.y;
    const canvasHeight = PongService.option.display.height;
    const canvasWidth = PongService.option.display.width;
    const cursor = room.GameOption.cursor;

    if (next.x < 0 || next.x + (ballSide) > canvasWidth) {
      if (next.x < 0) room.player[1].score++;
      else room.player[0].score++;
      this.gameService.emit(room, "scoreUpdate", {player1: {login: room.player[0].user.name, score: room.player[0].score}, player2: {login: room.player[1].user.name, score: room.player[1].score}});
      for (const player of room.player)
        if (player.score === 5 && room.gameIsStart)
          return this.gameService.stopGame(room, undefined);
      this.resetBall(room, next.x + (ballSide / 2) > canvasWidth);
    }
    if (next.y + ballSide >= (room.player[0].position.y) && next.y <= (room.player[0].position.y + (cursor.y)) && next.x < cursor.x)
      return this.updateBall(room.GameOption.ball.position.x, room.GameOption.ball.position.y, (Math.random() * Math.PI) / 2 - Math.PI / 4, room);
    if (next.y + ballSide >= (room.player[1].position.y) && next.y <= (room.player[1].position.y + (cursor.y)) && next.x + (ballSide) > canvasWidth - cursor.x)
      return this.updateBall(room.GameOption.ball.position.x, room.GameOption.ball.position.y, (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI, room);
    if (next.y < 0 || next.y + ballSide > canvasHeight)
        room.GameOption.ball.velocity.y *= -1;
    room.GameOption.ball.position.x += room.GameOption.ball.velocity.x;
    room.GameOption.ball.position.y += room.GameOption.ball.velocity.y;
    this.gameService.emit(room, "updateBall", room.GameOption.ball.position, {player1: room.player[0].position.y, player2: room.player[1].position.y});
  }
}
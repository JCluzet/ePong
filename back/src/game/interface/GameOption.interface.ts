interface IBall {
  x: number;
  y: number;
  ballspeed: number;
  speedConst: number;
  position: IPosition;
  velocity: IPosition;
}

export interface ICursor {
  x: number;
  y: number;
}

export interface IGameOption {
  optionName: string;
  ball: IBall;
  cursor: ICursor;

}

export interface IScore {
  player1: number;
  player2: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IOptionGame {
  classic: IGameOption;
  bigBall: IGameOption;
  fast: IGameOption;
}
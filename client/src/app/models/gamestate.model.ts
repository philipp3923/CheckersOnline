import PlayerModel from './player.model';
import { PlayModel } from './play.model';

export default interface GameStateModel {
  white: PlayerModel;
  black: PlayerModel;
  key: string;
  id: string;
  board: number[][];
  possibleTurns: PlayModel[];
  nextColor: number | null;
  winner: number | null;
  plays: PlayModel[];
  timestamp: number;
  timeType: number;
  time: number;
  increment: number;

  waiting: undefined;
}

export interface WaitingStateModel {
  key: string;
  timeType: number;
  time: number;
  increment: number;
  waiting: true;
  nextColor: undefined;
}

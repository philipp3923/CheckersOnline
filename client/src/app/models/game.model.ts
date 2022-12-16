import { PlayModel } from './play.model';

export default interface GameModel {
  id: string;
  type: string;

  start: number;

  winner: string;

  white: string;

  black: string;

  timeType: string;
  timeLimit: number;
  timeIncrement: number;
  plays?: PlayModel[];
}

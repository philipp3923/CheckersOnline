import PositionModel from './position.model';

export interface PlayModel {
  color: number | string;
  capture: boolean;
  start: PositionModel;
  target: PositionModel;
  time?: number;

  time_left?: number;
}

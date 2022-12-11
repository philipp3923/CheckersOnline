import PositionModel from "./position.model";

export interface PlayModel {
  color: number
  capture: boolean
  start: PositionModel
  target: PositionModel
  time?: number

  time_left?: number
}

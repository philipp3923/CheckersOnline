import {Play} from "../models/Board.model";
import PlaySchema from "./Play.schema";

export default interface GameSchema {
    id: string
    type: string

    start: number

    winner: string

    white: string

    black: string

    timeType: string
    timeLimit: number
    timeIncrement: number
    plays?: PlaySchema[]
}
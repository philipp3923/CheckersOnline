import UserGameModel, {GameState, Player} from "./UserGame.model";
import {Play} from "./Board.model";
import GameService from "../services/Game.service";
import {GameType} from "./Game.model";

const staticTimes = [60 * 1000, 5 * 60 * 1000, 10 * 60 * 1000, 30 * 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000];

export default class StaticGameModel extends UserGameModel {
    private readonly timeIndex: number;

    public constructor(gameService: GameService, id: string, key: string, type: GameType, time: number) {
        super(gameService, id, key, type, staticTimes[time]);
        this.timeIndex = time;
        if (!StaticGameModel.isValidTime(time)) {
            throw new Error("Illegal time provided")
        }
    }

    public static isValidTime(time: number): boolean {
        return time < staticTimes.length && time >= 0;
    }

    public getGameState(): GameState {
        const state = super.getGameState();
        state.timeType = 0;
        state.time = this.timeIndex;
        state.increment = 0;
        return state;
    }

    protected updateTime(player: Player, play: Play) {
        return;
    }
}

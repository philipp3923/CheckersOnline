import UserGameModel, {Player} from "./UserGame.model";
import {Play} from "./Board.model";
import GameService from "../services/Game.service";
import {GameType} from "./Game.model";
import {staticTimes} from "./StaticGame.model";

const dynamicTimes: number[] = [10*1000, 30*1000, 60*1000,10*60*1000, 30*60*1000,60*60*1000];
const dynamicIncrements: number[] = [0,10*1000, 30*1000, 60*1000,10*60*1000];
export default class DynamicGameModel extends UserGameModel{
    private increment: number;

    public constructor(gameService: GameService, id: string, key: string, type: GameType, time: number, increment: number) {
        super(gameService, id, key, type, dynamicTimes[time]);

        if(!DynamicGameModel.isValidTime(time, increment)){throw new Error("Illegal time provided")}
        this.increment = dynamicIncrements[increment];
    }

    protected updateTime(player: Player, play: Play): void {
        if(typeof play.time === "undefined"){throw new Error("play has no time")};
        player.time-= play.time;
        player.time += this.increment;
    }

    public static isValidTime(time: number, increment: number){
        return time < dynamicTimes.length && time >= 0 && increment < dynamicIncrements.length && increment > 0;

    }

}

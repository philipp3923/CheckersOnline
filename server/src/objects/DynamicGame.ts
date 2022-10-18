import UserGame, {Player} from "./UserGame";
import {Play} from "./Board";
import GameService from "../services/Game.service";
import {GameType} from "./Game";

const dynamicTimes = [{t: 60000, i: 0}, {t: 60000, i: 60000}];

export default class DynamicGame extends UserGame{

    public constructor(gameService: GameService, id: string, key: string, type: GameType, time: number, private increment: number) {
        super(gameService, id, key, type, time);

        if(!DynamicGame.isValidTime(time, increment)){throw new Error("Illegal time provided")};
    }

    protected updateTime(player: Player, play: Play): void {
        if(typeof play.time === "undefined"){throw new Error("play has no time")};
        player.time-= play.time;
        player.time += this.increment;
    }

    public static isValidTime(time: number, increment: number){
        for(const dynamicTime of dynamicTimes){
            if(dynamicTime.t === time && dynamicTime.i === increment){
                 return true;
            }
        }
        return false;
    }

}

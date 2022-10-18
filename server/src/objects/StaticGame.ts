import UserGame, {Player} from "./UserGame";
import {Play} from "./Board";
import GameService from "../services/Game.service";
import {GameType} from "./Game";

export const staticTimes = [60000, 120000];

export default class StaticGame extends UserGame{

    public constructor(gameService: GameService, id: string, key: string, type: GameType, time: number) {
        super(gameService, id, key, type, time);

        if(!StaticGame.isValidTime(time)){throw new Error("Illegal time provided")};
    }

    protected updateTime(player: Player, play: Play) {
        return;
    }

    public static isValidTime(time: number) :boolean{
        for(const staticTime of staticTimes){
            if(staticTime === time){
                return true;
            }
        }
        return false;
    }
}

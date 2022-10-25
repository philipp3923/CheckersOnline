import UserGameModel, {Player} from "./UserGame.model";
import {Play} from "./Board.model";
import GameService from "../services/Game.service";
import {GameType} from "./Game.model";

export const staticTimes = [60000, 120000];

export default class StaticGameModel extends UserGameModel{

    public constructor(gameService: GameService, id: string, key: string, type: GameType, time: number) {
        super(gameService, id, key, type, time);

        if(!StaticGameModel.isValidTime(time)){throw new Error("Illegal time provided")};
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

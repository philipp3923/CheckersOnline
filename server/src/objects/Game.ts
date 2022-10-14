import GameRepository from "../repositories/Game.repository";
import GameService from "../services/Game.service";

export enum GameType{
    FRIEND, CASUAL, RANKED, CUSTOM
}

export const gameTimeLimits =[
    0,
    1,
    3,
    5,
    10,
    20,
    30,
    60,
    120,
    3600,
    25200
];

export interface Player{
    id: string,
    time: number
}

export default class Game {
    private player: Player[];

    constructor(private gameService: GameService, private id: string, private key: string, private type: GameType, private time: number) {
        this.player = [];
    }

    public join(player: string){
        if (this.player.length >= 2) {
            return;
        }
        if (Math.random() >= 0.5) {
            this.player.push({id: player, time: this.time});
        } else {
            this.player.unshift({id: player, time: this.time});
        }
        if (this.player.length >= 2) {
            this.start();
        }
        console.log(this.player);
    }

    private start(){
        this.gameService.start(this);
        console.log(this);
    }

    public finish(){

    }

    public getID(){
        return this.id;
    }

    public getKey(){
        return this.key;
    }

    public getType(){
        return this.type;
    }

    public getBlack(): string | null{
        return this.player[1]?.id ?? null;
    }

    public getWhite(): string | null{
        return this.player[0]?.id ?? null;
    }

    public getTime(){
        return this.time;
    }

}
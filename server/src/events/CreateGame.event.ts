import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService, {TimeType} from "../services/Game.service";
import Connection from "../objects/Connection";
import Game, {GameType} from "../objects/Game";

export interface TimeDict{
    [id: string]: {time: number, increment: number}
}

export interface TimeObject{
    time: number, increment: number
}

export default class CreateGameEvent extends AbstractEvent {
    public constructor(socketService: SocketService, private gameService: GameService) {
        super(socketService, "createGame");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse) {
        if (connection.getGameCount() > 20) {
            respond({error: "Exceeded amount of possible simultaneous games"});
            return;
        }

        const timeType = this.getTimeTypeKeyByValue(args.timeType);
        const gameType = this.getGameTypeKeyByValue(args.gameType);

        if(typeof gameType === "undefined" || typeof timeType === "undefined"){
            respond({error: "Required arguments not provided"});
            return;
        }

        let game: Game | null = null;

        try{
            game = await this.gameService.createGame(gameType, timeType, args.time, args.increment);
        }catch (e){
            respond({error: "This specific game cannot be created"});
            return;
        }

        try {
            await connection.joinGame(game);
        }catch (e) {
            respond({error: "Game is full"});
            return;
        }

        respond({key: game.getKey()});
    }

    private getGameTypeKeyByValue(key: keyof typeof GameType): GameType | undefined{
        return GameType[key];
    }

    private getTimeTypeKeyByValue(key: keyof typeof TimeType): TimeType | undefined{
        return TimeType[key];
    }
}
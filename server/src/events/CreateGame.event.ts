import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService, {TimeType} from "../services/Game.service";
import Connection from "../objects/Connection";
import Game, {GameType} from "../objects/Game";
import FriendshipService from "../services/Friendship.service";
import UserGame from "../objects/UserGame";

export interface TimeDict{
    [id: string]: {time: number, increment: number}
}

export interface TimeObject{
    time: number, increment: number
}

export default class CreateGameEvent extends AbstractEvent {
    public constructor(socketService: SocketService, private gameService: GameService, private friendshipService: FriendshipService) {
        super(socketService, "createGame");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse) {
        if (connection.getGameCount() > 20) {
            respond({error: "Exceeded amount of possible simultaneous games"});
            return;
        }

        const timeType = this.getTimeTypeKeyByValue(args.timeType);
        const gameType = this.getGameTypeKeyByValue(args.gameType);

        if(typeof gameType === "undefined" || typeof timeType === "undefined" || (typeof args.invitation !== "string" && gameType === GameType.FRIEND)){
            respond({error: "Required arguments not provided"});
            return;
        }

        if(gameType === GameType.FRIEND && !(await this.friendshipService.exists(connection.getID(), args.invitation))){
            respond({error: "Friendship does not exist"});
            return;
        }

        if(!this.socketService.isOnline(args.invitation)){
            respond({error: "Friend is not online"});
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

        if(gameType === GameType.FRIEND){
            this.gameService.invitePlayer(<UserGame>game, args.invitation);
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
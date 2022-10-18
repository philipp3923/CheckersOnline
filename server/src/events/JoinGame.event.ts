import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService from "../services/Game.service";
import Connection from "../objects/Connection";

export default class JoinGameEvent extends AbstractEvent {
    public constructor(socketService: SocketService, private gameService: GameService) {
        super(socketService, "joinGame");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse) {
        if (connection.getGameCount() > 20) {
            respond({error: "Exceeded amount of possible simultaneous games"});
            return;
        }

        if(typeof args.key !== "string"){
            respond({error: "Invalid argument type"});
            return;
        }

        const game = this.gameService.getGame(args.key);

        if (game === null) {
            respond({error: "Game does not exist"});
            return;
        }

        try {
            await connection.joinGame(game);
        }catch (e) {
            respond({error: "Cannot join the same game twice"});
            return;
        }

    }
}
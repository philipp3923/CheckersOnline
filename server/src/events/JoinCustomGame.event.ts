import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService from "../services/Game.service";
import Connection from "../objects/Connection";

export default class JoinCustomGameEvent extends AbstractEvent {
    public constructor(socketService: SocketService, private gameService: GameService) {
        super(socketService, "joinCustomGame");
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

        const game = this.gameService.getCustom(args.key);

        if (game === null) {
            respond({error: "Invalid arguments provided"});
            return;
        }

        connection.joinGame(game);

    }
}
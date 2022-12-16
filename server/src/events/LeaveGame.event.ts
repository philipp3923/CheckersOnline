import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService from "../services/Game.service";
import Connection from "../models/Connection.model";

export default class LeaveGameEvent extends AbstractEvent {
    public constructor(socketService: SocketService, private gameService: GameService) {
        super(socketService, "leaveGame");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse) {
        console.log("TEST");
        if (typeof args.key !== "string") {
            respond({success: false, error: "Invalid argument type"});
            return;
        }

        const game = connection.getGame(args.key);

        if (game === null) {
            respond({success: false, error: "Cannot find game"});
            return;
        }

        await this.gameService.leaveGame(args.key, connection.getID());

        respond({success: true});
    }
}
import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import Connection from "../models/Connection.model";

export default class GamePlayEvent extends AbstractEvent {

    public constructor(socketService: SocketService) {
        super(socketService, "gamePlay");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse): Promise<void> {
        if (typeof args.key !== "string" || typeof args.index !== "number") {
            respond({success: false, error: "Invalid argument type"});
            return;
        }

        const game = connection.getGame(args.key);

        if (game === null) {
            respond({success: false, error: "Cannot find game"});
            return;
        }

        if (game.getNext() !== connection.getID()) {
            respond({success: false, error: "Not your turn"});
            return;
        }

        if (!await game.play(args.index)) {
            respond({success: false, error: "Illegal turn"});
            return;
        }

        respond({success: true});
    }
}

import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService from "../services/Game.service";
import Connection from "../models/Connection.model";

export default class TurnEvent extends AbstractEvent{

    public constructor(socketService: SocketService) {
        super(socketService, "gameTurn");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse): Promise<void> {
        if(typeof args.key !== "string" || typeof args.index !== "number"){
            respond({error: "Invalid argument type"});
            return;
        }

        const game = connection.getGame(args.key);

        if(game === null){
            respond({error: "Cannot find game"});
            return;
        }

        if(game.getNext() !== connection.getID()){
            respond({error: "Not your turn"});
            return;
        }

        if(!await game.play(args.index)){
            respond({error: "Illegal turn"});
            return;
        }

    }
}

import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService from "../services/Game.service";
import Connection from "../objects/Connection";
import {gameTimeLimits} from "../objects/Game";

export default class CreateCustomGameEvent extends AbstractEvent {
    public constructor(socketService: SocketService, private gameService: GameService) {
        super(socketService, "createCustomGame");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse) {
        if (connection.getGameCount() > 20) {
            respond({error: "Exceeded amount of possible simultaneous games"});
            return;
        }

        if(!gameTimeLimits.includes(args.time)){
            respond({error: "Invalid argument type"});
            return;
        }

        const game = await this.gameService.createCustom(args.time);

        if (game === null) {
            respond({error: "Invalid arguments provided"});
            return;
        }

        if(game.getWhite() === connection.getID() || game.getBlack() === connection.getID()){
            respond({error: "Cannot join the same game twice"});
            return;
        }

        connection.joinGame(game);

        respond({key: game.getKey()});
    }
}
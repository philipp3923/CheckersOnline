import AbstractEvent from "./Abstract.event";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService, {TimeType} from "../services/Game.service";
import Connection from "../models/Connection.model";
import Game, {GameType} from "../models/Game.model";

export default class CreateCustomGameEvent extends AbstractEvent {
    public constructor(
        socketService: SocketService,
        private gameService: GameService
    ) {
        super(socketService, "createCustomGame");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse) {
        if (connection.getGameCount() > 20) {
            respond({
                success: false,
                error: "Exceeded amount of possible simultaneous games",
            });
            return;
        }

        const timeType = this.getTimeTypeKeyByValue(args.timeType);

        if (
            typeof timeType === "undefined" || typeof args.time === "undefined"
        ) {
            respond({success: false, error: "Required arguments not provided"});
            return;
        }

        let game: Game | null = null;

        try {
            game = await this.gameService.createGame(
                GameType.CUSTOM,
                timeType,
                args.time,
                args.increment
            );
        } catch (e) {
            respond({
                success: false,
                error: "This specific game cannot be created",
            });
            return;
        }

        try {
            await connection.joinGame(game);
        } catch (e) {
            respond({success: false, error: "Game is full"});
            return;
        }

        respond({success: true, key: game.getKey()});
    }

    private getTimeTypeKeyByValue(
        key: keyof typeof TimeType
    ): TimeType | undefined {
        return TimeType[key];
    }
}

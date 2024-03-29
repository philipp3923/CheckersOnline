import SocketService, {AuthenticatableSocket,} from "../../services/Socket.service";
import TokenService from "../../services/Token.service";
import Connection from "../../models/Connection.model";
import GameService from "../../services/Game.service";
import FriendshipService from "../../services/Friendship.service";

export default class DecryptAccessTokenMiddleware {
    constructor(
        private socketService: SocketService,
        private tokenService: TokenService,
        private gameService: GameService,
        private friendshipService: FriendshipService
    ) {
        this.socketService.addMiddleware((socket, next) =>
            this.authenticate(socket, next)
        );
    }

    private async authenticate(socket: AuthenticatableSocket, next: Function) {
        const accessToken = socket.token;

        if (!accessToken) {
            const err = new Error("401");
            next(err);
            return;
        }

        const decryptedToken = await this.tokenService.decryptAccessToken(
            accessToken
        );

        if (decryptedToken === null) {
            const err = new Error("403");
            next(err);
            return;
        }
        const connection = this.socketService.getConnection(decryptedToken);

        if (connection === null) {
            socket.connection = new Connection(
                this.gameService,
                this.socketService,
                this.friendshipService,
                decryptedToken
            );
            await this.socketService.addConnection(socket.connection);
        } else {
            socket.connection = connection;
        }

        next();
    }
}

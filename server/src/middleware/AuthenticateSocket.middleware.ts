import SocketService, {AuthenticatedSocket} from "../services/Socket.service";
import TokenService from "../services/Token.service";

export default class AuthenticateSocketMiddleware {

    constructor(private socketService: SocketService, private tokenService : TokenService) {
        this.socketService.addMiddleware((socket, next) => this.authenticate(socket, next));
    }

    private async authenticate(socket: AuthenticatedSocket, next: Function) {
        const accessToken = socket.accessToken;

        if (!accessToken) {
            const err = new Error("401");
            next(err);
            return;
        }


        const decryptedToken = this.tokenService.decryptAccessToken(accessToken);

        if (decryptedToken === null) {
            const err = new Error("403");
            next(err);
            return;
        }
        socket.decryptedToken = decryptedToken;
        next();
    }
}
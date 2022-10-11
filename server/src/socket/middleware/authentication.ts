import {Socket} from "socket.io";
import {decryptAccessToken, DecryptedToken} from "../../data/tokens";
import {logsocket, LogStatus} from "../../utils/logmsg";

export interface AuthenticatedSocket extends Socket{
    decryptedToken: DecryptedToken
}

export async function authentication(socket: Socket, next: Function) {

    const accessToken = socket.handshake.auth.token;

    if (!accessToken) {
        const err = new Error("401");
        next(err);
        return;
    }

    const decryptedToken = await decryptAccessToken(accessToken);

    if (decryptedToken === null) {
        const err = new Error("403");
        logsocket(<AuthenticatedSocket>socket, LogStatus.WARNING, undefined, "invalid token submitted");
        next(err);
        return;
    }

    (<AuthenticatedSocket>socket).decryptedToken = decryptedToken;
    next();
}

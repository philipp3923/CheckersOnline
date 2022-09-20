import {verifyAccessToken} from "../tokens/verify";
import {NextFunction, Request, Response} from "express";

export async function requireAuthentication_Express(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.sendStatus(401);

    const decrypted_token = await verifyAccessToken(accessToken);

    if (decrypted_token === null) {
        return res.sendStatus(403);
    }

    req.user = {
        email: decrypted_token.email,
    };

    next();
}

export async function requireAuthentication_Socket(socket: AuthSocket, next: Function) {
    const accessToken = socket.handshake.auth.token;
    if (!accessToken) {
        const err = new Error("401");
        next(err);
        return;
    }

    const decrypted_token = await verifyAccessToken(accessToken);

    if (decrypted_token === null) {
        const err = new Error("403");
        next(err);
        return;
    }

    socket.user = {
        email: decrypted_token.email,
    };

    next();
}

import {verifyAccessToken} from "../tokens/verify";
import {NextFunction, Request, Response} from "express";

export default async function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.sendStatus(401);

    const decrypted_token = await verifyAccessToken(accessToken);

    if (decrypted_token === null) {
        return res.sendStatus(403);
    }

    console.log(decrypted_token);

    req.user = {
        email: decrypted_token.email,
    };

    next();
}

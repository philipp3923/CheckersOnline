import TokenService from "../../services/Token.service";
import {NextFunction, Request, Response} from "express";
import InterfaceMiddleware from "./Interface.middleware";

export default class DecryptAccessTokenMiddleware implements InterfaceMiddleware {

    constructor(private tokenService: TokenService) {
    }

    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).send();
            return;
        }

        const decryptedToken = await this.tokenService.decryptAccessToken(token);

        if (!decryptedToken) {
            res.status(401).send();
            return;
        }

        res.locals.accessToken = token;
        res.locals.id = decryptedToken.id;
        res.locals.role = decryptedToken.role;

        next();
    }

}
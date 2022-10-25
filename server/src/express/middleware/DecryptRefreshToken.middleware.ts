import TokenService from "../../services/Token.service";
import {NextFunction, Request, Response} from "express";

export default class DecryptRefreshTokenMiddleware {

    constructor(private tokenService: TokenService) {
    }

    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).send();
            return;
        }

        const decryptedToken = await this.tokenService.decryptRefreshToken(token);

        if (!decryptedToken) {
            res.status(401).send();
            return;
        }

        res.locals.refreshToken = token;
        res.locals.id = decryptedToken.account_id;
        res.locals.role = decryptedToken.role;

        next();
    }

}
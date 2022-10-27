import AbstractController from "./Abstract.controller";
import {NextFunction, Request, Response} from "express";
import TokenService from "../../services/Token.service";
import AccountService from "../../services/Account.service";

export default class LogoutController extends AbstractController{

    constructor(private tokenService: TokenService, private accountService: AccountService) {
        super();
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.tokenService.decryptRefreshToken(res.locals.refreshToken);
        await this.accountService.logout(res.locals.id);
        res.status(204).send();
    }

}
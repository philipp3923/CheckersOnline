import UserService from "../../services/User.service";
import TokenService, {DecryptedToken} from "../../services/Token.service";
import AbstractController from "./Abstract.controller";
import {Request, Response, NextFunction} from "express";

export class UpdateAccessTokenController extends AbstractController {

    constructor(private userService: UserService, private tokenService: TokenService) {
        super();
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const decryptedToken: DecryptedToken = {account_id: res.locals.id, role: res.locals.role}

        const accessToken = await this.tokenService.generateAccessToken(decryptedToken);

        res.json({accessToken: accessToken});
    }
}
export class UpdateRefreshTokenController extends AbstractController{

    constructor(private userService: UserService, private tokenService: TokenService) {
        super();
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {

        const refreshToken = await this.tokenService.updateRefreshToken(res.locals.refreshToken);

        res.json({refreshToken: refreshToken});
    }
}


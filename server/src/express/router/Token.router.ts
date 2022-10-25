import AbstractRouter from "./Abstract.router";
import {Router} from "express";
import TokenService from "../../services/Token.service";
import UserService from "../../services/User.service";
import {UpdateAccessTokenController, UpdateRefreshTokenController} from "../controller/UpdateToken.controller";
import DecryptRefreshTokenMiddleware from "../middleware/DecryptRefreshToken.middleware";

export default class TokenRouter extends AbstractRouter {

    constructor(path: string, app: Router, private tokenService: TokenService, private userService: UserService) {
        super(path, app);
        const decryptRefreshTokenMiddleware = new DecryptRefreshTokenMiddleware(tokenService);

        this.router.use((req, res, next) => decryptRefreshTokenMiddleware.handle(req, res, next));

        const updateRefreshTokenController = new UpdateRefreshTokenController(this.userService, this.tokenService);
        const updateAccessTokenController = new UpdateAccessTokenController(this.userService, this.tokenService);

        this.router.post("/refresh", (req, res, next) => updateRefreshTokenController.post(req, res, next));
        this.router.post("/access", (req, res, next) => updateAccessTokenController.post(req, res, next));
    }
}
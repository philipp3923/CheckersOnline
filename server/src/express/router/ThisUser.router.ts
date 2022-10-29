import AbstractRouter from "./Abstract.router";
import {Router} from "express";
import TokenService from "../../services/Token.service";
import GuestService from "../../services/Guest.service";
import UserService from "../../services/User.service";
import AccountService from "../../services/Account.service";
import DecryptRefreshTokenMiddleware from "../middleware/DecryptRefreshToken.middleware";
import IsUserParameterValidMiddleware from "../middleware/IsUserParameterValid.middleware";
import IsThisUserMiddleware from "../middleware/IsThisUser.middleware";
import UsernameController from "../controller/Username.controller";
import DecryptAccessTokenMiddleware from "../middleware/DecryptAccessToken.middleware";

export default class ThisUserRouter extends AbstractRouter{

    constructor(path: string, app: Router,
                private tokenService: TokenService,
                private userService: UserService,
                private decryptAccessTokenMiddleware: DecryptAccessTokenMiddleware,
                private isUserParameterValidMiddleware: IsUserParameterValidMiddleware,
                private isThisUserMiddleware: IsThisUserMiddleware) {
        super(path, app);

        this.router.use((req, res, next)=> decryptAccessTokenMiddleware.handle(req,res,next));
        this.router.use((req, res, next)=> isUserParameterValidMiddleware.handle(req,res,next));
        this.router.use((req, res, next)=> isThisUserMiddleware.handle(req,res,next));

        const usernameController = new UsernameController(tokenService,userService);

        this.router.patch("/username", (req, res, next) => usernameController.patch(req,res,next));
    }

}
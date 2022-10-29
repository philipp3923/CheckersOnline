import AbstractRouter from "./Abstract.router";
import {Router} from "express";
import TokenService from "../../services/Token.service";
import UserService from "../../services/User.service";
import AccountService from "../../services/Account.service";
import DecryptRefreshTokenMiddleware from "../middleware/DecryptRefreshToken.middleware";
import ThisUserRouter from "./ThisUser.router";
import IsUserParameterValidMiddleware from "../middleware/IsUserParameterValid.middleware";
import IsThisUserMiddleware from "../middleware/IsThisUser.middleware";
import DecryptAccessTokenMiddleware from "../middleware/DecryptAccessToken.middleware";

export default class UserRouter extends AbstractRouter {

    constructor(path: string, app: Router,
                private tokenService: TokenService,
                private userService: UserService,
                private accountService: AccountService,
                private decryptAccessTokenMiddleware: DecryptAccessTokenMiddleware,
                private isUserParameterValidMiddleware: IsUserParameterValidMiddleware,
                private isThisUserMiddleware: IsThisUserMiddleware) {
        super(path, app);

        new ThisUserRouter("/:id",
            this.router,
            tokenService,
            userService,
            decryptAccessTokenMiddleware,
            isUserParameterValidMiddleware,
            isThisUserMiddleware);
    }

}
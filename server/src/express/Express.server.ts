import express, {Express} from "express";
import AuthenticationRouter from "./router/Authentication.router";
import TokenService from "../services/Token.service";
import GuestService from "../services/Guest.service";
import UserService from "../services/User.service";
import DecryptRefreshTokenMiddleware from "./middleware/DecryptRefreshToken.middleware";
import AccountService from "../services/Account.service";
import IsThisUserMiddleware from "./middleware/IsThisUser.middleware";
import UserExistsMiddleware from "./middleware/UserExists.middleware";
import UserRouter from "./router/User.router";
import DecryptAccessTokenMiddleware from "./middleware/DecryptAccessToken.middleware";

export default class ExpressServer {

    constructor(private app: Express, private tokenService: TokenService, private guestService: GuestService, private userService: UserService, private accountService: AccountService) {
        this.app.use(express.json());

        const decryptRefreshTokenMiddleware = new DecryptRefreshTokenMiddleware(tokenService);
        const decryptAccessTokenMiddleware = new DecryptAccessTokenMiddleware(tokenService);
        const isThisUserMiddleware = new IsThisUserMiddleware();
        const isUserParameterValidMiddleware = new UserExistsMiddleware(accountService);


        new AuthenticationRouter("/auth", app, tokenService, guestService, userService, accountService, decryptRefreshTokenMiddleware);
        new UserRouter("/user", this.app, tokenService, userService, accountService, decryptAccessTokenMiddleware, isUserParameterValidMiddleware, isThisUserMiddleware)
    }

}
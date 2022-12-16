import AbstractRouter from "./Abstract.router";
import express, {Router} from "express";
import GameService from "../../services/Game.service";
import TokenService from "../../services/Token.service";
import GuestService from "../../services/Guest.service";
import UserService from "../../services/User.service";
import AccountService from "../../services/Account.service";
import DecryptRefreshTokenMiddleware from "../middleware/DecryptRefreshToken.middleware";
import DecryptAccessTokenMiddleware from "../middleware/DecryptAccessToken.middleware";
import IsThisUserMiddleware from "../middleware/IsThisUser.middleware";
import UserExistsMiddleware from "../middleware/UserExists.middleware";
import AuthenticationRouter from "./Authentication.router";
import UserRouter from "./User.router";
import GameRouter from "./Game.router";

export default class ApiRouter extends AbstractRouter {

    constructor(path: string, app: Router, private tokenService: TokenService, private guestService: GuestService, private userService: UserService, private accountService: AccountService, private gameService: GameService) {
        super(path, app);

        this.router.use(express.json());

        const decryptRefreshTokenMiddleware = new DecryptRefreshTokenMiddleware(tokenService);
        const decryptAccessTokenMiddleware = new DecryptAccessTokenMiddleware(tokenService);
        const isThisUserMiddleware = new IsThisUserMiddleware();
        const isUserParameterValidMiddleware = new UserExistsMiddleware(accountService);

        new AuthenticationRouter("/auth", this.router, tokenService, guestService, userService, accountService, decryptRefreshTokenMiddleware);
        new UserRouter("/user", this.router, tokenService, userService, accountService, gameService, decryptAccessTokenMiddleware, isUserParameterValidMiddleware, isThisUserMiddleware);
        new GameRouter("/game", this.router, gameService);
    }
}
import {Express} from "express";
import TokenService from "../services/Token.service";
import GuestService from "../services/Guest.service";
import UserService from "../services/User.service";
import AccountService from "../services/Account.service";
import GameService from "../services/Game.service";
import ApiRouter from "./router/Api.router";
import ClientRouter from "./router/Client.router";

export default class ExpressServer {

    constructor(private app: Express, private tokenService: TokenService, private guestService: GuestService, private userService: UserService, private accountService: AccountService, private gameService: GameService) {
        new ApiRouter("/api", app, tokenService, guestService, userService, accountService, gameService);
        new ClientRouter("/", app);
    }

}
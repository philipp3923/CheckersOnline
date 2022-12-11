import AbstractRouter from "./Abstract.router";
import {Router} from "express";
import TokenService from "../../services/Token.service";
import UserService from "../../services/User.service";
import DecryptRefreshTokenMiddleware from "../middleware/DecryptRefreshToken.middleware";
import {UpdateAccessTokenController, UpdateRefreshTokenController} from "../controller/UpdateToken.controller";
import GameService from "../../services/Game.service";
import GameController from "../controller/Game.controller";

export default class GameRouter extends AbstractRouter {

    constructor(path: string, app: Router, private gameService: GameService) {
        super(path, app);

        const gameController = new GameController(this.gameService);

        this.router.get("/:id", (req, res, next) => gameController.get(req, res, next));
    }
}
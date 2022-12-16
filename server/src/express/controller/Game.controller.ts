import AbstractController from "./Abstract.controller";
import {NextFunction, Request, Response} from "express";
import GameService from "../../services/Game.service";


export default class GameController extends AbstractController {
    constructor(private gameService: GameService) {
        super();
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;

        const game = await this.gameService.getFinishedGame(id);

        if (!game) {
            res.status(404);
            return;
        }

        res.send(game);
        next();
    }
}
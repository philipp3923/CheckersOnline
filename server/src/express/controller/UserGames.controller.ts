import AbstractController from "./Abstract.controller";
import { NextFunction, Request, Response } from "express";
import GameService from "../../services/Game.service";

export default class UserGamesController extends AbstractController {
  constructor(private gameService: GameService) {
    super();
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = req.params.id;
    const gamesOfUser = await this.gameService.getFinishedGamesOfUser(id);

    if (!gamesOfUser) {
      res.status(404);
      return;
    }
    res.send(gamesOfUser);
    next();
  }
}

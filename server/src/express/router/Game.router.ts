import AbstractRouter from "./Abstract.router";
import { Router } from "express";
import GameService from "../../services/Game.service";
import GameController from "../controller/Game.controller";

export default class GameRouter extends AbstractRouter {
  constructor(path: string, app: Router, private gameService: GameService) {
    super(path, app);

    const gameController = new GameController(this.gameService);

    this.router.get("/:id", (req, res, next) =>
      gameController.get(req, res, next)
    );
  }
}

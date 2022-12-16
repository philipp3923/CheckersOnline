import AbstractController from "./Abstract.controller";
import TokenService from "../../services/Token.service";
import { NextFunction, Request, Response } from "express";
import UserService from "../../services/User.service";

export default class UsernameController extends AbstractController {
  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {
    super();
  }

  public async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const username: string = req.body.username;

    if (!username) {
      res.status(406).send();
      return;
    }

    if (!this.userService.validateUsername(username)) {
      res.status(406).send();
      return;
    }

    if ((await this.userService.getByUsername(username)) !== null) {
      res.status(409).send();
      return;
    }

    await this.userService.changeUsername(res.locals.id, username);

    res.status(204).send();
  }
}

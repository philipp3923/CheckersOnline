import AbstractController from "./Abstract.controller";
import UserService from "../../services/User.service";
import { NextFunction, Request, Response } from "express";
import { DecryptedToken } from "../../services/Token.service";

export default class UserController extends AbstractController {
  constructor(private userService: UserService) {
    super();
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const username = await this.userService.getUsername(req.params.id);

    if (!username) {
      res.status(404).send();
      return;
    }

    res.json({ id: req.params.id, username: username });
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const password = req.query.password;
    const decryptedToken: DecryptedToken = {
      id: res.locals.id,
      role: res.locals.role,
    };

    if (!password || typeof password !== "string") {
      res.status(406).send();
      return;
    }

    if (!(await this.userService.authenticate(res.locals.id, password))) {
      res.status(403).send();
      return;
    }

    await this.userService.delete(decryptedToken);

    res.status(204).send();
  }
}

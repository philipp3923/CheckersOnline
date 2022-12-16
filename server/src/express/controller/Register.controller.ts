import UserService from "../../services/User.service";
import { NextFunction, Request, Response } from "express";
import AbstractController from "./Abstract.controller";

export default class RegisterController extends AbstractController {
  constructor(private userService: UserService) {
    super();
  }

  public async post(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      res.status(400).send();
      return;
    }

    if (
      !this.userService.validateEmail(email) ||
      !this.userService.validateUsername(username) ||
      !this.userService.validatePassword(password)
    ) {
      res.status(400).send();
      return;
    }

    if (
      (await this.userService.getByEmail(email)) !== null ||
      (await this.userService.getByUsername(username)) !== null
    ) {
      res.status(409).send();
      return;
    }

    await this.userService.create(email, username, password);

    res.status(204).send();
    return;
  }
}

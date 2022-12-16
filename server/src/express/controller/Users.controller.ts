import AbstractController from "./Abstract.controller";
import UserService from "../../services/User.service";
import { NextFunction, Request, Response } from "express";

export default class UsersController extends AbstractController {
  constructor(private userService: UserService) {
    super();
  }

  public async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const username = req.query.username;
    const email = req.query.email;

    if (!username && !email) {
      res.status(400).send();
      return;
    }

    if (typeof username === "string" && typeof email === "string") {
      res.status(400).send();
      return;
    }

    if (typeof username === "string") {
      res.json({
        user: await this.userService.getAllMatchingUsername(username),
      });
      return;
    }

    if (typeof email === "string") {
      res.json({ user: await this.userService.getAllMatchingEmail(email) });
      return;
    }

    res.status(400).send();
    return;
  }
}

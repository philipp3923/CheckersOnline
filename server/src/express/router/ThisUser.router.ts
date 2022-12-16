import AbstractRouter from "./Abstract.router";
import { Router } from "express";
import TokenService from "../../services/Token.service";
import UserService from "../../services/User.service";
import UserExistsMiddleware from "../middleware/UserExists.middleware";
import IsThisUserMiddleware from "../middleware/IsThisUser.middleware";
import UsernameController from "../controller/Username.controller";
import DecryptAccessTokenMiddleware from "../middleware/DecryptAccessToken.middleware";
import PasswordController from "../controller/Password.controller";
import EmailController from "../controller/Email.controller";
import UserController from "../controller/User.controller";

export default class ThisUserRouter extends AbstractRouter {
  constructor(
    path: string,
    app: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private decryptAccessTokenMiddleware: DecryptAccessTokenMiddleware,
    private isUserParameterValidMiddleware: UserExistsMiddleware,
    private isThisUserMiddleware: IsThisUserMiddleware
  ) {
    super(path, app);

    this.router.use((req, res, next) =>
      decryptAccessTokenMiddleware.handle(req, res, next)
    );
    this.router.use((req, res, next) =>
      isUserParameterValidMiddleware.handle(req, res, next)
    );
    this.router.use((req, res, next) =>
      isThisUserMiddleware.handle(req, res, next)
    );

    const usernameController = new UsernameController(
      tokenService,
      userService
    );
    const passwordController = new PasswordController(
      tokenService,
      userService
    );
    const emailController = new EmailController(tokenService, userService);
    const userController = new UserController(userService);

    this.router.delete("/", (req, res, next) =>
      userController.delete(req, res, next)
    );
    this.router.patch("/username", (req, res, next) =>
      usernameController.patch(req, res, next)
    );
    this.router.patch("/password", (req, res, next) =>
      passwordController.patch(req, res, next)
    );
    this.router.patch("/email", (req, res, next) =>
      emailController.patch(req, res, next)
    );
    this.router.get("/email", (req, res, next) =>
      emailController.get(req, res, next)
    );
  }
}

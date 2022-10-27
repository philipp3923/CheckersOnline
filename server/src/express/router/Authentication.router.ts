import AbstractRouter from "./Abstract.router";
import {Express, Router} from "express";
import GuestController from "../controller/Guest.controller";
import TokenService from "../../services/Token.service";
import GuestService from "../../services/Guest.service";
import LoginController from "../controller/Login.controller";
import UserService from "../../services/User.service";
import RegisterController from "../controller/Register.controller";
import TokenRouter from "./Token.router";
import DecryptRefreshTokenMiddleware from "../middleware/DecryptRefreshToken.middleware";
import LogoutController from "../controller/Logout.controller";
import AccountService from "../../services/Account.service";

export default class AuthenticationRouter extends AbstractRouter{

    constructor(path: string, app: Router, private tokenService: TokenService, private guestService: GuestService, private userService: UserService, private accountService: AccountService, private decryptRefreshTokenMiddleware: DecryptRefreshTokenMiddleware) {
        super(path, app);

        const guestController = new GuestController(this.tokenService, this.guestService);
        const loginController = new LoginController(this.userService, this.tokenService);
        const registerController = new RegisterController(this.userService);
        const logoutController = new LogoutController(this.tokenService, this.accountService);

        this.router.post("/guest", (req, res, next) => guestController.post(req, res, next));
        this.router.post("/login", (req, res, next) => loginController.post(req, res, next));
        this.router.post("/register", (req, res, next) => registerController.post(req, res, next));
        this.router.post("/logout", (req,res,next)=> decryptRefreshTokenMiddleware.handle(req,res,next), (req, res, next)=> logoutController.post(req,res,next));

        const tokenRouter = new TokenRouter("/token", this.router, tokenService, userService, decryptRefreshTokenMiddleware);
    }

}
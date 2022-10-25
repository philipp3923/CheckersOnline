import AbstractRouter from "./Abstract.router";
import {Express, Router} from "express";
import GuestController from "../controller/Guest.controller";
import TokenService from "../../services/Token.service";
import GuestService from "../../services/Guest.service";
import LoginController from "../controller/Login.controller";
import UserService from "../../services/User.service";
import RegisterController from "../controller/Register.controller";
import TokenRouter from "./Token.router";

export default class AuthenticationRouter extends AbstractRouter{

    constructor(path: string, app: Router, private tokenService: TokenService, private guestService: GuestService, private userService: UserService) {
        super(path, app);

        const guestController = new GuestController(this.tokenService, this.guestService);
        const loginController = new LoginController(this.userService, this.tokenService);
        const registerController = new RegisterController(this.userService);

        this.router.post("/guest", (req, res, next) => guestController.post(req, res, next));
        this.router.post("/login", (req, res, next) => loginController.post(req, res, next));
        this.router.post("/register", (req, res, next) => registerController.post(req, res, next));

        const tokenRouter = new TokenRouter("/token", this.router, tokenService, userService);
    }

}
import express, {Express} from "express";
import AuthenticationRouter from "./router/Authentication.router";
import TokenService from "../services/Token.service";
import GuestService from "../services/Guest.service";
import UserService from "../services/User.service";

export default class ExpressServer{

    constructor(private app : Express, private tokenService: TokenService, private guestService: GuestService, private userService: UserService) {
        this.app.use(express.json());

        new AuthenticationRouter("/auth", app, tokenService, guestService, userService);
    }

}
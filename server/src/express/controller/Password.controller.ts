import AbstractController from "./Abstract.controller";
import TokenService from "../../services/Token.service";
import GuestService from "../../services/Guest.service";
import {NextFunction, Request, Response} from "express";
import UserService from "../../services/User.service";

export default class PasswordController extends AbstractController{
    constructor(private tokenService: TokenService, private userService: UserService) {
        super();
    }

    public async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
        const password_old: string = req.body.password_old;
        const password_new: string = req.body.password_new;

        if(!password_old || !password_new){
            res.status(406).send();
            return;
        }

        if(! await this.userService.authenticate(res.locals.id, password_old)){
            res.status(403).send();
            return;
        }

        if(!this.userService.validatePassword(password_new)){
            res.status(406).send();
            return;
        }

        await this.userService.changePassword(res.locals.id, password_new);

        res.status(204).send();
    }
}
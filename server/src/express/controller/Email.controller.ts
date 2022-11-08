import TokenService from "../../services/Token.service";
import UserService from "../../services/User.service";
import {NextFunction, Request, Response} from "express";
import AbstractController from "./Abstract.controller";

export default class EmailController extends AbstractController{
    constructor(private tokenService: TokenService, private userService: UserService) {
        super();
    }

    public async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
        const email: string = req.body.email;

        if(!email){
            res.status(406).send();
            return;
        }

        if(!this.userService.validateEmail(email)){
            res.status(406).send();
            return;
        }

        if (await this.userService.getByEmail(email) !== null) {
            res.status(409).send();
            return;
        }

        await this.userService.changeEmail(res.locals.id, email);

        res.status(204).send();
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.json({email: await this.userService.getEmail(res.locals.id)});
    }

}
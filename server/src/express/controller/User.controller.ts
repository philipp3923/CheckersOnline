import AbstractController from "./Abstract.controller";
import UserService from "../../services/User.service";
import {NextFunction, Request, Response} from "express";

export default class UserController extends AbstractController{

    constructor(private userService: UserService) {
        super();
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        const username = await this.userService.getUsername(req.params.id);

        if(!username){
            res.status(404).send();
            return;
        }

        res.json({id: req.params.id, username: username});
    }
}
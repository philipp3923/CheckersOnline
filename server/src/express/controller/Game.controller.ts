import UserService from "../../services/User.service";
import TokenService from "../../services/Token.service";
import AbstractController from "./Abstract.controller";
import {NextFunction, Request, Response} from "express";


export default class GameController extends AbstractController{
    constructor(private tokenService: TokenService, private userService: UserService) {
        super();
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
}
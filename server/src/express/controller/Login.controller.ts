import UserService from "../../services/User.service";
import TokenService, {Role} from "../../services/Token.service";
import AbstractController from "./Abstract.controller";
import {Request, Response, NextFunction} from "express";

export default class LoginController extends AbstractController {

    constructor(private userService: UserService, private tokenService: TokenService) {
        super();
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {username, password} = req.body;

        if (!username || !password) {
            res.status(400).send();
            return;
        }

        const user_id = await this.userService.getByUsername(username);

        if(user_id === null){
            res.status(404).send();
            return;
        }

        if (!(await this.userService.authenticate(user_id, password))) {
            res.status(409).send();
            return;
        }

        const decryptedToken = {id: user_id, role: Role.USER};

        await this.userService.login(user_id);

        res.json(await this.tokenService.createTokenResponse(decryptedToken));
    }
}
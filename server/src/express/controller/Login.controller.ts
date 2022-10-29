import UserService from "../../services/User.service";
import TokenService, {Role} from "../../services/Token.service";
import AbstractController from "./Abstract.controller";
import {Request, Response, NextFunction} from "express";

export default class LoginController extends AbstractController {

    constructor(private userService: UserService, private tokenService: TokenService) {
        super();
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {user, password} = req.body;

        if (!user || !password) {
            res.status(400).send();
            return;
        }

        if(await this.userService.getByUsernameOrEmail(user) === null){
            res.status(404).send();
            return;
        }

        if (!(await this.userService.authenticate(user, password))) {
            res.status(409).send();
            return;
        }

        const account_id = await this.userService.getByUsernameOrEmail(user);
        if (account_id === null) {
            throw new Error("Account for user does not exist " + user);
        }

        const decryptedToken = {id: account_id, role: Role.USER};

        await this.userService.login(account_id);

        res.json(await this.tokenService.createTokenResponse(decryptedToken));
    }
}
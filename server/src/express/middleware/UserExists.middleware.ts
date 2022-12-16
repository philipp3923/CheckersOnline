import {NextFunction, Request, Response} from "express";
import AccountService from "../../services/Account.service";
import InterfaceMiddleware from "./Interface.middleware";

export default class UserExistsMiddleware implements InterfaceMiddleware {
    constructor(private accountService: AccountService) {
    }

    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = await this.accountService.get(req.params.id);
        if (user === null || user.role !== "USER") {
            res.status(403).send("Given parameter is not a valid User ID");
            return;
        }

        next();
    }
}
import {NextFunction, Request, Response} from "express";
import InterfaceMiddleware from "./Interface.middleware";

export default class IsThisUserMiddleware implements InterfaceMiddleware{
    constructor() {
    }

    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        if(req.params.id !== res.locals.id){
            res.status(403).send();
            return;
        }

        next();
    }
}
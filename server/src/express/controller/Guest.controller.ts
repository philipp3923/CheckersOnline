import TokenService, {Role} from "../../services/Token.service";
import GuestService from "../../services/Guest.service";
import AbstractController from "./Abstract.controller";
import {NextFunction, Request, Response} from "express";

export default class GuestController extends AbstractController {

    constructor(private tokenService: TokenService, private guestService: GuestService) {
        super();
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = await this.guestService.create();
        const decryptedToken = {id: id, role: Role.GUEST};
        //console.log("REQUEST");
        res.json(await this.tokenService.createTokenResponse(decryptedToken));
    }

}
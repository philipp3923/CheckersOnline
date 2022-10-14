import AbstractController, {RequestType, Response} from "./Abstract.controller";
import TokenService, {Role} from "../services/Token.service";
import Router from "../objects/Router";
import GuestService from "../services/Guest.service";

export default class GuestController extends AbstractController{

    constructor(private tokenService: TokenService, private guestService: GuestService, router: Router) {
        super(router, RequestType.POST, "/guest");
    }

    public async handle(headers: any, body: any): Promise<Response> {
        let response: Response = {status: 200};

        const id = await this.guestService.create();
        const decryptedToken = {account_id: id, role: Role.GUEST};

        response.json = await this.tokenService.createTokenResponse(decryptedToken);
        return response;
    }

}
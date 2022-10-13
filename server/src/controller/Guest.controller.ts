import AbstractController, {RequestType, Response} from "./Abstract.controller";
import UserService from "../services/User.service";
import TokenService, {Role} from "../services/Token.service";
import Router from "../router/Router";
import IdentityService from "../services/Identitity.service";

export default class GuestController extends AbstractController{

    constructor(private tokenService: TokenService, private identitiyService: IdentityService, router: Router) {
        super(router, RequestType.POST, "/guest");
    }

    public async handle(headers: any, body: any): Promise<Response> {
        let response: Response = {status: 200};

        const guest_id = await this.identitiyService.generateGuestID();
        const decryptedToken = {account_id: guest_id, role: Role.GUEST};

        response.json = await this.tokenService.createTokenResponse(decryptedToken);
        return response;
    }

}
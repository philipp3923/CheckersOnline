import UserService from "../services/User.service";
import TokenService, {Role} from "../services/Token.service";
import AbstractController, {RequestType, Response} from "./Abstract.controller";
import Router from "../router/Router";

export default class LoginController extends AbstractController{

    constructor(private userService: UserService, private tokenService: TokenService, router: Router) {
        super(router, RequestType.POST, "/login");
    }

    public async handle(headers: any, body: any): Promise<Response> {
        const {name, password} = body;
        let response: Response = {status: 200};

        if (!name|| !password) {
            response.status = 400;
            return response;
        }

        if (!(await this.userService.authenticate(name, password))) {
            response.status = 409;
            return response;
        }


        const account_id = await this.userService.getByUsernameOrEmail(name);
        if(account_id === null){
            throw new Error("Account for user does not exist " + name);
        }

        const decryptedToken = {account_id: account_id, role: Role.USER};

        response.json = await this.tokenService.createTokenResponse(decryptedToken);
        return response;
    }
}
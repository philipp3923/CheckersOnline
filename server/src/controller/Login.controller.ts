import UserService from "../services/User.service";
import TokenService, {Role} from "../services/Token.service";
import AbstractController, {RequestType, Response} from "./Abstract.controller";
import Router from "../objects/Router";

export default class LoginController extends AbstractController{

    constructor(private userService: UserService, private tokenService: TokenService, router: Router) {
        super(router, RequestType.POST, "/login");
    }

    public async handle(headers: any, body: any): Promise<Response> {
        const {user, password} = body;
        let response: Response = {status: 200};

        if (!user || !password) {
            response.status = 400;
            return response;
        }

        if (!(await this.userService.authenticate(user, password))) {
            response.status = 409;
            return response;
        }


        const account_id = await this.userService.getByUsernameOrEmail(user);
        if(account_id === null){
            throw new Error("Account for user does not exist " + user);
        }

        const decryptedToken = {account_id: account_id, role: Role.USER};

        await this.userService.login(account_id);

        response.json = await this.tokenService.createTokenResponse(decryptedToken);
        return response;
    }
}
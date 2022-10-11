import UserService from "../service/User.service";
import Response from "../data/Response";
import TokenService, {Role} from "../services/Token.service";

export default class LoginController {


    constructor(private userService: UserService, private tokenService: TokenService) {
    }

    public async login(name?: string, password?: string): Promise<Response> {
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

        const accessToken = await this.tokenService.generateAccessToken(decryptedToken);
        const refreshToken = await this.tokenService.generateRefreshToken(decryptedToken);

        response.json = {accessToken: accessToken, refreshToken: refreshToken, user: decryptedToken};
        return response;
    }
}
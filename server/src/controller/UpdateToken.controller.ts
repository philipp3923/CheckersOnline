import UserService from "../services/User.service";
import TokenService from "../services/Token.service";
import AbstractController, {RequestType, Response} from "./Abstract.controller";
import Router from "../objects/Router";

export class UpdateAccessTokenController extends AbstractController {

    constructor(private userService: UserService, private tokenService: TokenService, router : Router) {
        super(router, RequestType.POST, "/accessToken");
    }


    public async handle(headers: any, body: any): Promise<Response>{
        const token = headers.authorization?.split(" ")[1];
        let response: Response = {status: 200};

        if (!token) {
            response.status = 401;
            return response;
        }

        const oldDecryptedToken = await this.tokenService.decryptRefreshToken(token);

        if (!oldDecryptedToken) {
            response.status = 403;
            return response;
        }

        const newEncryptedToken = await this.tokenService.generateAccessToken(oldDecryptedToken);

        response.json = {accessToken: newEncryptedToken};
        return response;
    }
}
export class UpdateRefreshTokenController extends AbstractController{

    constructor(private userService: UserService, private tokenService: TokenService, router: Router) {
        super(router, RequestType.POST, "/refreshToken");
    }

    public async handle(headers: any, body: any): Promise<Response>{
        const token = headers.authorization?.split(" ")[1];
        let response: Response = {status: 200};

        if (!token) {
            response.status = 401;
            return response;
        }

        const oldDecryptedToken = await this.tokenService.decryptRefreshToken(token);

        if(!oldDecryptedToken){
            response.status = 403;
            return response;
        }

        const newEncryptedToken = await this.tokenService.updateRefreshToken(token);

        response.json = {refreshToken: newEncryptedToken};
        return response;
    }
}


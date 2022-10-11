import UserService from "../services/User.service";
import TokenService from "../services/Token.service";
import Response from "../data/Response";

export default class UpdateTokenController {

    constructor(private userService: UserService, private tokenService: TokenService) {
    }


    public async updateAccessToken(token?: string): Promise<Response>{
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

        const newEncryptedToken = await this.tokenService.generateAccessToken(oldDecryptedToken);

        response.json = {accessToken: newEncryptedToken};
        return response;
    }

    public async updateRefreshToken(token?: string): Promise<Response>{
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
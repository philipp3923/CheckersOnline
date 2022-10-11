import UserService from "../services/User.service";
import {Response} from "./Abstract.controller";

export default class RegisterController {


    constructor(private userService: UserService) {
    }

    public async register(username?: string , email?: string, password?: string): Promise<Response> {
        let response: Response = {status: 200};

        if (!email || !password || !username) {
            response.status = 400;
            return response;
        }

        if (!this.userService.validateEmail(email) || !this.userService.validateUsername(username) || !this.userService.validatePassword(password)) {
            response.status = 400;
            return response;
        }

        if (await this.userService.getByEmail(email) !== null || await this.userService.getByUsername(username) !== null) {
            response.status = 409;
            return response;
        }

        await this.userService.create(email, username, password);

        return response;
    }
}
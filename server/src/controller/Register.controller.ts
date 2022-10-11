import UserService from "../services/User.service";
import AbstractController, {RequestType, Response} from "./Abstract.controller";
import Router from "../router/Router";

export default class RegisterController extends AbstractController{


    constructor(private userService: UserService, router: Router) {
        super(router, RequestType.POST, "/register");
    }

    public async handle(headers: any, body: any): Promise<Response> {
        const {username, email, password} = body;
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
import UserService from "../services/User.service";
import express, {Express, Router} from "express";
import RegisterController from "../controller/Register.controller";
import TokenService from "../services/Token.service";
import LoginController from "../controller/Login.controller";
import UpdateTokenController from "../controller/UpdateToken.controller";

export default class AuthRouter {
    private readonly router: Router;
    private registerController: RegisterController;
    private loginController: LoginController;
    private updateTokenController: UpdateTokenController;

    constructor(private userService: UserService, private tokenService: TokenService, private app: Express, private route: string) {
        this.router = express.Router();
        this.app.use(this.route, this.router);
        this.registerController = new RegisterController(userService);
        this.loginController = new LoginController(userService, tokenService);
        this.updateTokenController = new UpdateTokenController(userService, tokenService);
        this.setUpRoutes();
    }

    private setUpRoutes(){
        this.router.post("/register", async (req, res, next) => {
            const {email, username, password} = req.body;
            const response = await this.registerController.register(username,email, password);
            res.status(response.status);
            res.json(response.json);
            next();
        });

        this.router.post("/login",async (req, res, next) => {
            const {name, password} = req.body;
            const response = await this.loginController.login(name, password);
            res.status(response.status);
            res.json(response.json);
            next();
        });

        this.router.post("/update/refreshToken",async (req, res, next) => {
            const token = req.headers.authorization?.split(" ")[1];
            const response = await this.updateTokenController.updateRefreshToken(token);
            res.status(response.status);
            res.json(response.json);
            next();
        });

        this.router.post("/update/accessToken",async (req, res, next) => {
            const token = req.headers.authorization?.split(" ")[1];
            const response = await this.updateTokenController.updateAccessToken(token);
            res.status(response.status);
            res.json(response.json);
            next();
        });
    }
}
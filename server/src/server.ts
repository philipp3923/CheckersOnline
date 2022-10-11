import {Server} from "socket.io";
import {createServer} from "http";
import UserRepository from "./repositories/User.repository";
import {PrismaClient} from "@prisma/client";
import EncryptionRepository from "./repositories/Encryption.repository";
import UserService from "./services/User.service";
import IdentityRepository from "./repositories/Identity.repository";
import express from "express";
import TokenRepository from "./repositories/Token.repository";
import TokenService from "./services/Token.service";
import SocketRepository from "./repositories/Socket.repository";
import SocketService from "./services/Socket.service";
import PlayEvent from "./events/Play.event";
import AuthenticateSocketMiddleware from "./middleware/AuthenticateSocket.middleware";
import ApiRepository from "./repositories/Api.repository";
import ApiService from "./services/Api.service";
import Router from "./router/Router";
import LoginController from "./controller/Login.controller";
import {UpdateAccessTokenController, UpdateRefreshTokenController} from "./controller/UpdateToken.controller";
import RegisterController from "./controller/Register.controller";

//#TODO move constants to central file
const JWT_REFRESH_SECRET = "aNMkyXrdEgGCQw6OpdnTsh1XEEKb5pbMaA1mfEfGLD6GHyAQriU4qWVsbpp5RsMCXIiCT27LnDCb72OUUX6xFCmdp1rB1eSxlW6A6XVZeprS681oFLaEKnWQOAQsNEhY";
const JWT_ACCESS_SECRET = "ZdTytDiVUWcSfVh62VfiQ5mcV3JCT6exTHTNCOZH9XOdMXft82UiMToVtyfIsOenSE5BAullDJJqwOJSVVN1pvSsyOfjK7w8pLzgtznLxp5rGUG58D17rS7Ryltf8yIA";
const JWT_TOKEN_COUNT = 10;

const app = express();
const server = createServer(app);
const io = new Server(server);
const prismaClient = new PrismaClient();


const userRepository = new UserRepository(prismaClient);
const identRepository = new IdentityRepository(prismaClient);
const encryptionRepository = new EncryptionRepository(10);
const tokenRepository = new TokenRepository(prismaClient);
const socketRepository = new SocketRepository(io);
const apiRepository = new ApiRepository(app);

const userService = new UserService(userRepository, encryptionRepository, identRepository);
const tokenService = new TokenService(tokenRepository, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_COUNT);
const socketService = new SocketService(socketRepository);
const apiService = new ApiService(apiRepository);

const authRouter = new Router(apiService, "/auth");

const loginController = new LoginController(userService,tokenService, authRouter);
const registerController = new RegisterController(userService, authRouter);
const updateAccessTokenController = new UpdateAccessTokenController(userService,tokenService,authRouter);
const updateRefreshTokenController = new UpdateRefreshTokenController(userService,tokenService,authRouter);

const authenticateSocketMiddleware = new AuthenticateSocketMiddleware(socketService, tokenService);

const playEvent = new PlayEvent(socketService, "play");


server.listen(5000, () => console.log("listening on port 5000"));
socketService.start();
apiService.start();
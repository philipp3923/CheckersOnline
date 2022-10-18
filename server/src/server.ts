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
import AuthenticateSocketMiddleware from "./middleware/AuthenticateSocket.middleware";
import ApiRepository from "./repositories/Api.repository";
import ApiService from "./services/Api.service";
import Router from "./objects/Router";
import LoginController from "./controller/Login.controller";
import {UpdateAccessTokenController, UpdateRefreshTokenController} from "./controller/UpdateToken.controller";
import RegisterController from "./controller/Register.controller";
import GuestController from "./controller/Guest.controller";
import GuestRepository from "./repositories/Guest.repository";
import GuestService from "./services/Guest.service";
import AccountRepository from "./repositories/Account.repository";
import GameRepository from "./repositories/Game.repository";
import GameService from "./services/Game.service";
import PingEvent from "./events/Ping.event";
import JoinGameEvent from "./events/JoinGame.event";
import CreateGameEvent from "./events/CreateGame.event";
import TurnEvent from "./events/Turn.event";
import FriendshipRepository from "./repositories/Friendship.repository";
import FriendshipService from "./services/Friendship.service";

//#TODO move constants to central file
const JWT_REFRESH_SECRET = "aNMkyXrdEgGCQw6OpdnTsh1XEEKb5pbMaA1mfEfGLD6GHyAQriU4qWVsbpp5RsMCXIiCT27LnDCb72OUUX6xFCmdp1rB1eSxlW6A6XVZeprS681oFLaEKnWQOAQsNEhY";
const JWT_ACCESS_SECRET = "ZdTytDiVUWcSfVh62VfiQ5mcV3JCT6exTHTNCOZH9XOdMXft82UiMToVtyfIsOenSE5BAullDJJqwOJSVVN1pvSsyOfjK7w8pLzgtznLxp5rGUG58D17rS7Ryltf8yIA";
const JWT_TOKEN_COUNT = 10;

const app = express();
const server = createServer(app);
const io = new Server(server);
const prismaClient = new PrismaClient();

const accountRepository = new AccountRepository(prismaClient);
const userRepository = new UserRepository(prismaClient, accountRepository);
const guestRepository = new GuestRepository(prismaClient, accountRepository);
const gameRepository = new GameRepository(prismaClient);
const identityRepository = new IdentityRepository(prismaClient);
const encryptionRepository = new EncryptionRepository(10);
const tokenRepository = new TokenRepository(prismaClient);
const socketRepository = new SocketRepository(io, gameRepository);
const apiRepository = new ApiRepository(app);
const friendshipRepository = new FriendshipRepository(prismaClient, userRepository);

const userService = new UserService(userRepository, encryptionRepository, identityRepository);
const tokenService = new TokenService(tokenRepository, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_COUNT);
const socketService = new SocketService(socketRepository);
const apiService = new ApiService(apiRepository);
const guestService = new GuestService(guestRepository, identityRepository);
const gameService = new GameService(gameRepository, identityRepository, socketService);
const friendshipService = new FriendshipService(friendshipRepository, accountRepository, socketService);

const authRouter = new Router(apiService, "/auth");
const updateRouter = new Router(apiService, "/auth/update");

const loginController = new LoginController(userService,tokenService, authRouter);
const registerController = new RegisterController(userService, authRouter);
const guestController = new GuestController(tokenService, guestService, authRouter);
const updateAccessTokenController = new UpdateAccessTokenController(userService,tokenService,updateRouter);
const updateRefreshTokenController = new UpdateRefreshTokenController(userService,tokenService,updateRouter);

const authenticateSocketMiddleware = new AuthenticateSocketMiddleware(socketService, tokenService, gameService, friendshipService);

const joinCustomGameEvent = new JoinGameEvent(socketService, gameService);
const createCustomGameEvent = new CreateGameEvent(socketService, gameService);
const gameTurnEvent = new TurnEvent(socketService);
const pingEvent = new PingEvent(socketService);

server.listen(5000, () => console.log("listening on port 5000"));
socketService.start();
apiService.start();
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
import DecryptAccessTokenMiddleware from "./socketio/middleware/DecryptAccessToken.middleware";
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
import FriendEvent from "./events/Friend.event";
import ExpressServer from "./express/Express.server";
import AccountService from "./services/Account.service";

//#TODO move constants to central file
const JWT_REFRESH_SECRET =
    "aNMkyXrdEgGCQw6OpdnTsh1XEEKb5pbMaA1mfEfGLD6GHyAQriU4qWVsbpp5RsMCXIiCT27LnDCb72OUUX6xFCmdp1rB1eSxlW6A6XVZeprS681oFLaEKnWQOAQsNEhY";
const JWT_ACCESS_SECRET =
    "ZdTytDiVUWcSfVh62VfiQ5mcV3JCT6exTHTNCOZH9XOdMXft82UiMToVtyfIsOenSE5BAullDJJqwOJSVVN1pvSsyOfjK7w8pLzgtznLxp5rGUG58D17rS7Ryltf8yIA";
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
const friendshipRepository = new FriendshipRepository(
    prismaClient,
    userRepository
);


const tokenService = new TokenService(
    tokenRepository,
    accountRepository,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_TOKEN_COUNT
);
const socketService = new SocketService(socketRepository);
const guestService = new GuestService(guestRepository, identityRepository);
const gameService = new GameService(
    gameRepository,
    identityRepository,
    socketService
);
const friendshipService = new FriendshipService(
    friendshipRepository,
    accountRepository,
    socketService
);
const accountService = new AccountService(accountRepository);
const userService = new UserService(
    userRepository,
    encryptionRepository,
    identityRepository,
    accountRepository,
    friendshipService,
    socketService
);
const authenticateSocketMiddleware = new DecryptAccessTokenMiddleware(
    socketService,
    tokenService,
    gameService,
    friendshipService
);

const joinCustomGameEvent = new JoinGameEvent(socketService, gameService);
const createCustomGameEvent = new CreateGameEvent(
    socketService,
    gameService,
    friendshipService
);
const turnEvent = new TurnEvent(socketService);
const pingEvent = new PingEvent(socketService);
const friendEvent = new FriendEvent(socketService, friendshipService);

const expressServer = new ExpressServer(
    app,
    tokenService,
    guestService,
    userService,
    accountService
);

server.listen(5000, () => console.log("listening on port 5000"));
socketService.start();

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
import TurnEvent from "./events/GamePlay.event";
import FriendshipRepository from "./repositories/Friendship.repository";
import FriendshipService from "./services/Friendship.service";
import ExpressServer from "./express/Express.server";
import AccountService from "./services/Account.service";
import LeaveGameEvent from "./events/LeaveGame.event";
import dotenv from 'dotenv';
import FriendRequestEvent from "./events/FriendRequest.event";
import FriendAcceptEvent from "./events/FriendAccept.event";
import FriendDeleteEvent from "./events/FriendDelete.event";
import CreateCustomGameEvent from "./events/CreateCustomGame.event";

dotenv.config({path: "../.env"});

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
    accountRepository,
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
new DecryptAccessTokenMiddleware(
    socketService,
    tokenService,
    gameService,
    friendshipService
);

new JoinGameEvent(socketService, gameService);
new CreateCustomGameEvent(socketService, gameService);
new TurnEvent(socketService);
new PingEvent(socketService);
new FriendRequestEvent(socketService, friendshipService);
new FriendDeleteEvent(socketService, friendshipService);
new FriendAcceptEvent(socketService, friendshipService);
new LeaveGameEvent(socketService, gameService);

new ExpressServer(
    app,
    tokenService,
    guestService,
    userService,
    accountService,
    gameService
);

server.listen(process.env.SERVER_PORT, () => console.log(`App listening at http://localhost:${process.env.SERVER_PORT}`));
socketService.start();

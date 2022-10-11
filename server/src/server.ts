import {Server, Socket} from "socket.io";
import {createServer} from "http";
import UserRepository from "./repositories/User.repository";
import {PrismaClient} from "@prisma/client";
import EncryptionRepository from "./repositories/Encryption.repository";
import UserService from "./services/User.service";
import IdentityRepository from "./repositories/Identity.repository";
import express from "express";
import AuthRouter from "./router/Auth.router";
import TokenRepository from "./repositories/Token.repository";
import TokenService from "./services/Token.service";
import SocketRepository from "./repositories/Socket.repository";
import SocketService from "./services/Socket.service";
import PlayEvent from "./events/Play.event";
import AuthenticateSocketMiddleware from "./middleware/AuthenticateSocket.middleware";

//#TODO move constants to central file
const JWT_REFRESH_SECRET = "aNMkyXrdEgGCQw6OpdnTsh1XEEKb5pbMaA1mfEfGLD6GHyAQriU4qWVsbpp5RsMCXIiCT27LnDCb72OUUX6xFCmdp1rB1eSxlW6A6XVZeprS681oFLaEKnWQOAQsNEhY";
const JWT_ACCESS_SECRET = "ZdTytDiVUWcSfVh62VfiQ5mcV3JCT6exTHTNCOZH9XOdMXft82UiMToVtyfIsOenSE5BAullDJJqwOJSVVN1pvSsyOfjK7w8pLzgtznLxp5rGUG58D17rS7Ryltf8yIA";
const JWT_TOKEN_COUNT = 10;


const app = express();
const server = createServer(app);
const io = new Server(server);
const prismaClient = new PrismaClient();

app.use(express.json());

const userRepository = new UserRepository(prismaClient);
const identRepository = new IdentityRepository(prismaClient);
const encryptionRepository = new EncryptionRepository(10);
const tokenRepository = new TokenRepository(prismaClient);
const socketRepository = new SocketRepository(io);

const userService = new UserService(userRepository, encryptionRepository, identRepository);
const tokenService = new TokenService(tokenRepository, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_COUNT);
const socketService = new SocketService(socketRepository);

const authRouter = new AuthRouter(userService, tokenService, app, "/auth");
const authenticateSocketMiddleware = new AuthenticateSocketMiddleware(socketService, tokenService);
const playEvent = new PlayEvent(socketService, "play");

/*
io.use(authentication);
io.on("connection", (socket: Socket) => {
    connection(io, <AuthenticatedSocket>socket);
});*/

server.listen(5000, () => console.log("listening on port 5000"));
socketService.start();
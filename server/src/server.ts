import UserSocketMap from "./sockets/UserSocketMap";

require("dotenv").config();

import GameHandler from "./checkers/GameHandler";
import socketConnection from "./sockets/SocketConnection";
import {Socket, Server} from "socket.io";
import authRouter from "./routes/Authentication";
import {createServer} from "http";
import {requireAuthentication_Socket} from "./middleware/RequireAuthentication";

const express = require("express");

const app = express();

const server = createServer(app);
const io = new Server(server);
const gameHandler = new GameHandler();
const userSocketMap = new UserSocketMap();

app.use(express.json());

app.use("/auth", authRouter);

// socketio init

io.use(requireAuthentication_Socket);

io.on("connection", (socket: Socket) => {
    socketConnection(io, socket, gameHandler, userSocketMap);
});

server.listen(5000, () => console.log("server listening on port 5000"));

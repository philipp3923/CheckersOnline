require("dotenv").config();

import connection from "./sockets/connection";
import {Socket, Server} from "socket.io";
import authRouter from "./routes/authentication";
import {createServer} from "http";
import {requireAuthentication_Socket} from "./middleware/requireAuthentication";

const express = require("express");

const app = express();

const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use("/auth", authRouter);

// socketio init

io.use(requireAuthentication_Socket);

io.on("connection", (socket: Socket) => {
    connection(io, socket);
});

server.listen(5000, () => console.log("server listening on port 5000"));
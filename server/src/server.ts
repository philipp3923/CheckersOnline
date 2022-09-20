import {Socket, Server} from "socket.io";
import authRouter from "./routes/authentication";
import {createServer} from "http";

require("dotenv").config();

const express = require("express");

const app = express();

const server = createServer(app);
const io = new Server(server);

const onConnection = require("./sockets/connection");

app.use(express.json());

app.use("/auth", authRouter);

// socketio init

io.on("connection", (socket: Socket) => {
    onConnection(io, socket);
});

server.listen(5000, () => console.log("server listening on port 5000"));

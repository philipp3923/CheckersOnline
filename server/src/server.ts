import {Socket, Server} from "socket.io";

require("dotenv").config();

const http = require("http");
const express = require("express");

const app = express();
const authRouter = require("./routes/authentication");

const server = http.createServer(app);
const io = new Server(server);

const onConnection = require("./sockets/connection");

app.use(express.json());

app.use("/auth", authRouter);

// socketio init

io.on("connection", (socket: Socket) => {
    onConnection(io, socket);
});

server.listen(5000, () => console.log("server listening on port 5000"));

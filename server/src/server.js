require("dotenv").config();

const http = require("http");
const express = require("express");

const app = express();
const authRouter = require("./routes/authentication");

const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const onConnection = require("./sockets/connection");

app.use(express.json());

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }

    console.log("====================");
    console.table(req);
    console.log("--------------------");
    console.log(err);
    console.log("====================");
    res.status(500);
});

// socketio init

io.on("connection", (socket) => {
    onConnection(io, socket);
});

server.listen(5000, () => console.log("server listening on port 5000"));

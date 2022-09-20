require("dotenv").config();

const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require('socket.io')(server);

const authRouter = require("./routes/authentication");

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

io.on('connection', (socket) => onConnection(io,socket));

app.listen(5000, () => console.log("server listening on port 5000"));

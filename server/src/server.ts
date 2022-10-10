import {Server} from "socket.io";
import {createServer} from "http";
import authRouter from "./routes/auth";
import logmsg, {LogStatus, LogType} from "./utils/logmsg";

const express = require("express");

const app = express();

const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use("/auth", authRouter);


server.listen(5000, () => logmsg(LogType.START, LogStatus.SUCCESS, "listening on port 5000"));

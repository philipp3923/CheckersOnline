import {Server} from "socket.io";
import {createServer} from "http";
import authRouter from "./routes/auth";

const express = require("express");

const app = express();

const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use("/auth", authRouter);


server.listen(5000, () => console.log("START: listening on port 5000"));

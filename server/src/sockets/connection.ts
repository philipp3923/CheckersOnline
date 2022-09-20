import {Server,Socket} from "socket.io";

export default async function connection(io: Server, socket: Socket) {
    console.log("CONNECTED");
}

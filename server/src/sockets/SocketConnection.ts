import {Server} from "socket.io";

export default async function socketConnection(io: Server, socket: AuthSocket) {
    console.log(socket.user);
}

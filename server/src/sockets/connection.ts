import {Server} from "socket.io";

export default async function connection(io: Server, socket: AuthSocket) {
    console.log(socket.user);
}

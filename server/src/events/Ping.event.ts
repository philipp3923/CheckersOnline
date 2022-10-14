import AbstractEvent from "./Abstract.event";
import Connection from "../objects/Connection";
import SocketService, {SocketResponse} from "../services/Socket.service";

export default class PingEvent extends AbstractEvent{

    constructor(socketService: SocketService) {
        super(socketService, "ping");
    }

    on(socket: Connection, args: Object, respond: SocketResponse): void {
        respond(args);
    }

}
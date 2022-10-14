import SocketService, {AuthenticatedSocket, SocketResponse} from "../services/Socket.service";
import {DecryptedToken} from "../services/Token.service";
import Connection from "../objects/Connection";

export default abstract class AbstractEvent {

    public constructor(private socketService: SocketService, private event: string) {
        this.socketService.addEvent(this);
    }

    public getEvent(){
        return this.event;
    }

    public abstract on(socket: Connection, args: Object, respond?: SocketResponse): void;

}
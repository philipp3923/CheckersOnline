import SocketService, {SocketResponse} from "../services/Socket.service";
import Connection from "../models/Connection.model";

export default abstract class AbstractEvent {

    public constructor(protected socketService: SocketService, private event: string) {
        this.socketService.addEvent(this);
    }

    public getEvent() {
        return this.event;
    }

    public abstract on(connection: Connection, args: any, respond?: SocketResponse): void;

}
import SocketService from "../services/Socket.service";
import {DecryptedToken} from "../services/Token.service";

export default abstract class AbstractEvent {

    public constructor(private socketService: SocketService, private event: string) {
        this.socketService.addEvent(this.event,this.on);
    }

    protected abstract on(decryptedToken: DecryptedToken, args: Object): void;

}
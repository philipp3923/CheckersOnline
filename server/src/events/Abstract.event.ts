import SocketService from "../services/Socket.service";
import {DecryptedToken} from "../services/Token.service";

export default abstract class AbstractEvent {

    public constructor(private socketService: SocketService, private event: string) {
        this.socketService.addEvent(this.event,(decryptedToken, args) => this.on(decryptedToken, args));
    }

    protected abstract on(decryptedToken: DecryptedToken, args: Object): void;

}
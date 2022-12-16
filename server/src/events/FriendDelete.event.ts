import AbstractEvent from "./Abstract.event";
import Connection from "../models/Connection.model";
import SocketService, {SocketResponse} from "../services/Socket.service";
import FriendshipService from "../services/Friendship.service";

export default class FriendDeleteEvent extends AbstractEvent {

    public constructor(socketService: SocketService, private friendshipService: FriendshipService) {
        super(socketService, "friendDelete");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse): Promise<void> {
        if (typeof args.friend !== "string") {
            respond({success: false, error: "Invalid argument type"});
            return;
        }

        try {
            await this.friendshipService.delete(connection.getID(), args.friend);
        } catch (e) {
            respond({success: false, error: "Illegal operation"});
            return;
        }

        respond({success: true});
    }

}
import AbstractEvent from "./Abstract.event";
import Connection from "../models/Connection.model";
import SocketService, {SocketResponse} from "../services/Socket.service";
import GameService from "../services/Game.service";
import FriendshipService from "../services/Friendship.service";

export default class FriendEvent extends AbstractEvent{

    public constructor(socketService: SocketService, private friendshipService: FriendshipService) {
        super(socketService, "friend");
    }

    public async on(connection: Connection, args: any, respond: SocketResponse): Promise<void> {
        if(typeof args.type === "undefined" || typeof args.friend !== "string"){
            respond({error: "Invalid argument type"});
            return;
        }

        try {
            switch (args.type) {
                case "REQUEST":
                    await this.friendshipService.request(connection.getID(), args.friend);
                    break
                case "ACCEPT":
                    await this.friendshipService.accept(connection.getID(), args.friend);
                    break
                case "DELETE":
                    await this.friendshipService.delete(connection.getID(), args.friend);
                    break
                default:
                    throw new Error();
            }
        }catch (e){
            respond({error: "Illegal operation"});
            return;
        }
    }

}
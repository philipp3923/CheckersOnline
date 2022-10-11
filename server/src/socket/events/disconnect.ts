import {Server} from "socket.io";
import {AuthenticatedSocket} from "../middleware/authentication";
import {logsocket, LogStatus} from "../../utils/logmsg";
import * as accounts from "../../data/accounts";

export default function disconnect(io: Server, socket: AuthenticatedSocket){
    socket.on("disconnect", on_disconnect);

    function on_disconnect(){
        accounts.disconnect(socket.decryptedToken.account_id, socket.id);
        logsocket(socket, LogStatus.SUCCESS, undefined, "disconnected");
    }
}


import AbstractEvent from "./Abstract.event";
import {DecryptedToken} from "../services/Token.service";

export default class PlayEvent extends AbstractEvent{
    protected on(decryptedToken: DecryptedToken, args: Object): void {
        console.log("PlayEvent!");
        console.log(args);
        console.log(decryptedToken);
    }

}
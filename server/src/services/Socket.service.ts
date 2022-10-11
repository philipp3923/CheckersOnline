import {DecryptedToken} from "./Token.service";
import SocketRepository from "../repositories/Socket.repository";


export interface AuthenticatedSocket{
    decryptedToken?: DecryptedToken
}

export interface SocketEventListener{
    event: string,
    fn: (decryptedToken: DecryptedToken, args: Object) => void
}

export default class SocketService{

    constructor(private socketRepository: SocketRepository) {

    }

    private addMiddleware(fn: (socket: AuthenticatedSocket, next: Function) => void){
        this.socketRepository.addMiddleware(fn);
    }

    public addEvent(event: string, fn: (decryptedToken: DecryptedToken, args: Object) => void){
        this.socketRepository.addEvent({event: event, fn: fn});
    }

    public start(){
        this.socketRepository.onConnection();
    }

}
import {DecryptedToken} from "./Token.service";
import SocketRepository from "../repositories/Socket.repository";
import Connection from "../objects/Connection";
import AbstractEvent from "../events/Abstract.event";


export interface AuthenticatedSocket{
    connection: Connection
}

export interface AuthenticatableSocket{
    connection?: Connection,
    token?: string
}

export interface Socket{
    id: string,
    send: (event: string, msg: any) => void,
    join: (room: string) => void,
    leave: (room: string) => void
}

export interface SocketEventListener{
    event: string,
    fn: (connection: Connection, args: Object, respond?: SocketResponse) => void
}

export type SocketResponse = (args: Object) => void

export default class SocketService{

    constructor(private socketRepository: SocketRepository) {

    }

    public addMiddleware(fn: (socket: AuthenticatableSocket, next: Function) => void){
        this.socketRepository.addMiddleware(fn);
    }

    public addEvent(event: AbstractEvent){
        this.socketRepository.addEvent({event: event.getEvent(), fn: (connection, args, respond) => event.on(connection, args, respond)});
    }

    public start(){
        this.socketRepository.onConnection();
    }

    public getConnection(decryptedToken: DecryptedToken): Connection | null{
        return this.socketRepository.getConnection(decryptedToken.account_id);
    }

    public addConnection(connection: Connection){
        this.socketRepository.addConnection(connection);
    }

    public removeConnection(connection: Connection){
        this.socketRepository.removeConnection(connection.getID());
    }

    public sendIn(room: string, event: string, msg: any){
        this.socketRepository.emitIn(room, event, msg);
    }

    public sendTo(id: string, event: string, msg: any){
        this.socketRepository.emitIn(id,event,msg);
    }

}
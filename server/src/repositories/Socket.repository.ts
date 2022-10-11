import {Server, Socket} from "socket.io";
import {AuthenticatedSocket, SocketEventListener} from "../services/Socket.service";
import {DecryptedToken} from "../services/Token.service";

export interface ExtendedAuthenticatedSocket extends Socket{
    decryptedToken?: DecryptedToken,
    accessToken?: string
}

export default class SocketRepository{
    private readonly eventListeners: SocketEventListener[];

    constructor(private io: Server){
        this.eventListeners=[];
    }

    public addMiddleware(fn: (socket: AuthenticatedSocket, next: Function) => void){
        this.io.use((socket, next) => {
            (<AuthenticatedSocket>socket).accessToken = socket.handshake.auth.token;
            fn(<AuthenticatedSocket>socket, next);
        });
    }

    //#TODO CHANGE AS LIST AND ADD LATER
    public addEvent(socketEventListener: SocketEventListener){
        this.eventListeners.push(socketEventListener);
    }

    public onConnection(){
        this.io.on("connection", (socket: ExtendedAuthenticatedSocket)=> {
            for(const eventListener of this.eventListeners){
                socket.on(eventListener.event, (args) => eventListener.fn(<DecryptedToken>socket.decryptedToken, args));
            }
        });
    }
}
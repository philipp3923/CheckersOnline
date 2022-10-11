import {Server, Socket} from "socket.io";
import {AuthenticatedSocket, SocketEventListener} from "../services/Socket.service";
import {DecryptedToken} from "../services/Token.service";

export interface ExtendedAuthenticatedSocket extends Socket{
    decryptedToken?: DecryptedToken,
    accessToken?: string
}

export default class SocketRepository{
    private readonly eventListeners: SocketEventListener[];
    private readonly connections: { [ext_id: string]: string[] };

    constructor(private io: Server){
        this.eventListeners=[];
        this.connections = {};
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
            if(typeof socket.decryptedToken === "undefined" || typeof socket.accessToken === "undefined"){
                throw new Error("Socket without token connected");
            }

            this.connect(socket.decryptedToken.account_id, socket.id);

            for(const eventListener of this.eventListeners){
                socket.on(eventListener.event, (args) => eventListener.fn(<DecryptedToken>socket.decryptedToken, args));
            }

            socket.on("disconnect", ()=>this.disconnect(socket.decryptedToken?.account_id ?? "", socket.id));
        });
    }

    private connect(accountID: string, socketID: string){
        if (typeof this.connections[accountID] === "undefined") {
            this.connections[accountID] = [];
        }
        this.connections[accountID].push(socketID);
        console.log(this.connections);
    }

    private disconnect(accountID: string, socketID: string){
        const result = this.connections[accountID];
        const index = result?.indexOf(socketID);

        if (index < 0 || typeof index === "undefined") {
            throw new Error("Trying to disconnect non existent account connection");
        }

        result.splice(index, 1);

        if (result.length < 1) {
            delete this.connections[accountID];
        }
        console.log(this.connections);
    }

    private getConnections(accountID: string){
        const result = this.connections[accountID];

        if (typeof result === "undefined") {
            throw new Error("Trying to access non existent account connections");
        }

        return result;
    }
}
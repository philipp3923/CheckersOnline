import {DecryptedToken} from "../services/Token.service";
import SocketService, {Socket} from "../services/Socket.service";
import GameService from "../services/Game.service";
import UserGame from "./UserGame";
import Game from "./Game";

export default class Connection {
    private sockets: Socket[];
    private games: {[id: string]: Game};

    constructor(private socketService: SocketService, private decryptedToken: DecryptedToken) {
        this.sockets = [];
        this.games = {};
    }

    public addSocket(socket: Socket){
        this.sockets.push(socket);
    }

    public removeSocket(id: string){
        const index = this.sockets?.map(socket=>socket.id).indexOf(id);
        this.sockets.splice(index, 1);

        if(this.sockets.length <= 0){
            this.socketService.removeConnection(this);
        }
    }

    public async joinGame(game: Game){
        this.games[game.getKey()] = game;
        for(const socket of this.sockets){
            socket.join(game.getKey());
        }
        if(game instanceof UserGame){
            await game.join(this.decryptedToken.account_id);
        }
    }

    public leaveGame(game: UserGame) {
        delete this.games[game.getKey()];
        for(const socket of this.sockets){
            socket.leave(game.getKey());
        }
    }

    public getGame(key: string){
        return this.games[key] ?? null;
    }

    public getGameCount(){
        return Object.keys(this.games).length;
    }

    public getID(){
        return this.decryptedToken.account_id;
    }



    public send(event: string, msg: any){
        this.socketService.emitIn(this.decryptedToken.account_id,event,msg);

    }


}
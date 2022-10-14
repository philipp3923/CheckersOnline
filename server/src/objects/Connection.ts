import Game, {GameType} from "./Game";
import {DecryptedToken} from "../services/Token.service";
import SocketService, {Socket} from "../services/Socket.service";
import GameService from "../services/Game.service";

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

    public joinGame(game: Game){
        this.games[game.getID()] = game;
        for(const socket of this.sockets){
            socket.join(game.getID());
        }
        game.join(this.decryptedToken.account_id);
    }

    public leaveGame(game: Game) {
        delete this.games[game.getID()];
        for(const socket of this.sockets){
            socket.leave(game.getID());
        }
    }

    public getGame(id: string){
        return this.games[id] ?? null;
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
import {DecryptedToken, Role} from "../services/Token.service";
import SocketService, {Socket} from "../services/Socket.service";
import UserGameModel from "./UserGame.model";
import GameModel from "./Game.model";
import FriendshipService from "../services/Friendship.service";
import GameService from "../services/Game.service";

export default class ConnectionModel {
    private sockets: Socket[];
    private readonly games: {[id: string]: GameModel};

    constructor(private gameService: GameService, private socketService: SocketService, private friendshipService: FriendshipService, private decryptedToken: DecryptedToken) {
        this.sockets = [];
        this.games = this.gameService.getGamesByUserID(this.decryptedToken.id);
    }

    public async goOnline(){
        if(this.decryptedToken.role === Role.GUEST){return}
        for(const friendship of await this.friendshipService.getFriends(this.decryptedToken.id)){
            if(friendship.friend === this.decryptedToken.id || friendship.status !== "ACTIVE"){continue}
            this.socketService.sendTo(friendship.friend, "online", this.decryptedToken.id);
        }
    }

    public async goOffline(){
        if(this.decryptedToken.role === Role.GUEST){return}
        for(const friendship of await this.friendshipService.getFriends(this.decryptedToken.id)){
            if(friendship.friend === this.decryptedToken.id || friendship.status !== "ACTIVE"){continue}
            this.socketService.sendTo(friendship.friend, "offline", this.decryptedToken.id);
        }
    }

    public async addSocket(socket: Socket){
        this.sockets.push(socket);
        socket.join(this.decryptedToken.id);
        const states: any = {};
        for(let key of Object.keys(this.games)){
            states[key] = this.games[key].getGameState();
            if(states[key].white === null || states[key].black === null){
                states[key] = {key: key, timeType: states[key].timeType, time: states[key].time, increment: states[key].increment, waiting: true};
            }
            socket.join(key);
        }
        if(this.decryptedToken.role !== Role.GUEST){
            socket.send("welcome", {friends: await this.friendshipService.getFriends(this.decryptedToken.id), games : states});
        }else{
            socket.send("welcome", {games: states});
        }
    }

    public async removeSocket(id: string){
        const index = this.sockets?.map(socket=>socket.id).indexOf(id);
        this.sockets.splice(index, 1);

        if(this.sockets.length <= 0){
            await this.socketService.removeConnection(this);
        }
    }

    public async joinGame(game: GameModel){
        this.games[game.getKey()] = game;
        for(const socket of this.sockets){
            socket.join(game.getKey());
        }
        if(game instanceof UserGameModel){
            await game.join(this.decryptedToken.id);
        }
    }

    public leaveGame(game: UserGameModel) {
        delete this.games[game.getKey()];
        for(const socket of this.sockets){
            socket.leave(game.getKey());
        }
    }

    public removeGame(game: UserGameModel){
        delete this.games[game.getKey()];
    }

    public getGame(key: string){
        return this.games[key] ?? null;
    }

    public getGameCount(){
        return Object.keys(this.games).length;
    }

    public getID(){
        return this.decryptedToken.id;
    }

    public send(event: string, msg: any){
        this.socketService.sendTo(this.decryptedToken.id,event,msg);
    }

    public async disconnectAllSockets(){
        for(let socket of this.sockets){
            socket.disconnect();
        }
        this.sockets = [];
        await this.socketService.removeConnection(this);
    }


}
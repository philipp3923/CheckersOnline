import {Injectable} from '@angular/core';
import {io, Socket} from "socket.io-client";
import GameStateModel from "../../models/gamestate.model";
import {Subject} from "rxjs";
import FriendshipModel from "../../models/friendship.model";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket | null = null;
  private connected: Subject<boolean>;
  private readonly listeners: { event: string, listener: Function }[];
  private pendingEmits: { event: string, args: any, callback?: Function }[];

  constructor() {
    this.listeners = [];
    this.pendingEmits = [];
    this.connected = new Subject();
    this.connected.next(this.isConnected());
  }

  public isConnected() {
    return !!this.socket?.connected;
  }

  public isConnectedObserver() {
    return this.connected.asObservable();
  }

  public connect(token: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io("localhost:4200", {
      auth: {
        token: token
      },
    });
    this.socket.on("connect", () => this.connected.next(true));
    this.socket.on("disconnect", () => this.connected.next(false));


    for (const listener of this.listeners) {
      this.socket.on(listener.event, (args: any) => listener.listener(args));
    }

    for (const pendingEmit of this.pendingEmits) {
      this.socket.emit(pendingEmit.event, pendingEmit.args, (args: any) => {
        pendingEmit.callback ? pendingEmit.callback(args) : null;
      });
    }

    this.clearPendingEmits();
  }

  public createCustomGame(dynamic: boolean, time: number, increment: number, callback: (res: any) => void) {
    this.socket?.emit("createGame", {
      gameType: "CUSTOM", timeType: dynamic ? "DYNAMIC" : "STATIC", time: time, increment: increment
    }, (res: any) => callback(res));
  }

  public joinCustomGame(key: string, callback: (res: any) => void) {
    this.emit("joinGame", {key: key}, (res: any) => callback(res));
  }

  public joinCasualGame(dynamic: boolean, time: number, increment: number, callback: (res: any) => void) {
    this.emit("createGame", {
      gameType: "CASUAL", timeType: dynamic ? "DYNAMIC" : "STATIC", time: time, increment: increment
    }, (res: any) => callback(res));
  }

  public requestFriend(id: string, callback: (res: any) => void) {
    this.emit("friend", {
      type: "REQUEST", friend: id
    }, (res: any) => callback(res))
  }

  public acceptFriend(id: string, callback: (res: any) => void) {
    this.emit("friend", {
      type: "ACCEPT", friend: id
    }, (res: any) => callback(res))
  }

  public deleteFriend(id: string, callback: (res: any) => void) {
    this.emit("friend", {
      type: "DELETE", friend: id
    }, (res: any) => callback(res))
  }

  public leaveGame(key: string, callback: (res: any) => void) {
    this.emit("leaveGame", {key: key}, (res: any) => callback(res));
  }

  public playMove(key: string, index: number) {
    this.emit("gameTurn", {key: key, index: index}, (res: any) => console.log(res));
  }

  public addGameStateListener(listener: (gameState: GameStateModel) => void) {
    this.addListener("gameState", listener);
  }

  public addFriendRequestListener(listener: (friendship: FriendshipModel) => void) {
    this.addListener("friendRequest", listener);
  }

  public addFriendAcceptListener(listener: (friendship: FriendshipModel) => void) {
    this.addListener("friendAccept", listener);
  }

  public addFriendDeleteListener(listener: (friendship: FriendshipModel) => void) {
    this.addListener("friendDelete", listener);
  }

  public addFriendOnlineListener(listener: (friend_id: string) => void) {
    this.addListener("online", listener);
  }

  public addFriendOfflineListener(listener: (friend_id: string) => void) {
    this.addListener("offline", listener);
  }

  public addWelcomeListener(listener: (res: any) => void) {
    this.addListener("welcome", listener);
  }

  public addGameLeaveListener(listener: (res: any) => void) {
    this.addListener("leave", listener);
  }

  public clearPendingEmits() {
    this.pendingEmits = [];
  }

  public disconnect() {
    this.socket?.disconnect();
    this.connected.next(false);
    this.socket = null;
  }

  private addListener(event: string, listener: Function) {
    this.listeners.push({event: event, listener: listener});
    if (this.socket) {
      this.socket.on(event, (args: any) => listener(args));
    }
  }

  private emit(event: string, args: any, callback?: Function) {
    if (this.socket) {
      this.socket.emit(event, args, callback ? (args: any) => callback(args) : undefined);
    } else {
      this.pendingEmits.push({event: event, args: args, callback: callback});
    }
  }
}

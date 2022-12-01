import {Injectable} from '@angular/core';
import {io, Socket} from "socket.io-client";
import GameStateModel from "../../models/gamestate.model";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket | null = null;
  private listeners: {event: string, listener: Function}[];

  constructor() {
    this.listeners = [];
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

    this.socket.on("welcome", (args) => console.log(args));

    for(const listener of this.listeners){
      this.socket.on(listener.event, (args:any) => listener.listener(args));
    }
  }

  public createCustomGame(dynamic: boolean, time: number, increment: number, callback: (res:any)=> void) {
    this.socket?.emit("createGame", {
      gameType: "CUSTOM",
      timeType: dynamic ? "DYNAMIC" : "STATIC",
      time: time,
      increment: increment
    }, (res: any) => callback(res));
  }

  public joinCustomGame(key: string, callback: (res:any)=> void) {
    this.socket?.emit("joinGame", {key: key}, (res: any) => callback(res));
  }

  public joinCasualGame(dynamic: boolean, time: number, increment: number, callback: (res:any)=> void) {
    this.socket?.emit("createGame", {
      gameType: "CASUAL",
      timeType: dynamic ? "DYNAMIC" : "STATIC",
      time: time,
      increment: increment
    }, (res: any) => callback(res));
  }

  public playMove(key: string, index: number){
    this.socket?.emit("gameTurn", {key: key, index: index}, (res: any) => console.log(res));
  }

  public addGameStateListener(listener: (gameState: GameStateModel) => void){
    this.addListener("gameState", listener);
  }

  private addListener(event: string, listener: Function){
    this.listeners.push({event: event, listener: listener});
    if(this.socket){
      this.socket.on(event, (args:any) => listener(args));
    }
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

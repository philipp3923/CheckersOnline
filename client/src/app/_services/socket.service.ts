import {Injectable} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket | null = null;

  constructor(private storageService: StorageService) {
  }

  public connect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = io("localhost:4200", {
      auth: {
        token: this.storageService.getAccessToken()?.token
      },
    });
    setTimeout(() => {
      this.socket?.emit("ping", {msg: "Hallo!"}, (response: Object) => {
        console.log(response);
      });
    }, 1000);

    this.socket.on("gameState", (args) => {
      console.log(args);
      setTimeout(() => {
        const user = this.storageService.getUser()?.account_id;
        if ((user === args.black.id && args.nextColor === 1) || (user === args.white.id && args.nextColor === -1)) {
          const index = this.generateRandom(0, args.possibleTurns.length - 1);
          console.log("playing... " + index);
          this.gameTurn(args.key, index);
        }else{
          console.log("waiting...");
          return;
        }
      }, 2000);
    });
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  public createCustom(time: number) {
    console.log(this.socket?.id);
    this.socket?.emit("createGame", {gameType: "CUSTOM", timeType: "STATIC", time: 60000, increment: 0}, (res: any) => console.log(res));
  }

  public joinCustom(key: string) {
    console.log(this.socket?.id);
    this.socket?.emit("joinGame", {key: key}, (res: any) => console.log(res));
  }

  public gameTurn(key: number, index: number) {
    this.socket?.emit("gameTurn", {key: key, index: index}, (res: any) => console.log(res));
  }

  private generateRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


}

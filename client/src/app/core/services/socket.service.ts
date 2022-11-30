import { Injectable } from '@angular/core';
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket | null = null;

  constructor() { }

  public connect(token: string){
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io("localhost:4200", {
      auth: {
        token: token
      },
    });

    this.socket.on("welcome", (args)=>console.log(args));
    setTimeout(() => {
      this.socket?.emit("ping", {msg: "Hallo!"}, (response: Object) => {
        console.log(response);
      });
    }, 100);
  }

  public disconnect(){
    this.socket?.disconnect();
    this.socket = null;
  }
}

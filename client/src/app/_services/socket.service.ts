import { Injectable } from '@angular/core';
import {io, Socket} from "socket.io-client";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket | null = null;

  constructor(private storageService: StorageService) {}

  public connect(){
    if(this.socket){
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
  }

  public disconnect(){
    this.socket?.disconnect();
    this.socket = null;
  }

  public createCustom(time: number){
    console.log(this.socket?.id);
    this.socket?.emit("createCustomGame", {time: time}, (res: any) => console.log(res));
  }

  public joinCustom(key: string){
    console.log(this.socket?.id);
    this.socket?.emit("joinCustomGame", {key: key}, (res: any) => console.log(res));
  }


}

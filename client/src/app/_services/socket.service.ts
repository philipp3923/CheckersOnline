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
  }

  public disconnect(){
    this.socket?.disconnect();
    this.socket = null;
  }


}

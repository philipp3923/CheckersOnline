import { Component, OnInit } from '@angular/core';
import {SocketService} from "../_services/socket.service";

@Component({
  selector: 'app-page-friends',
  templateUrl: './page-friends.component.html',
  styleUrls: ['./page-friends.component.css']
})
export class PageFriendsComponent implements OnInit {
  friend = null;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
  }

  public onAccept(){
    this.socketService.acceptFriend(this.friend ?? "");
    this.friend = null;
  }

  public onRequest(){
    this.socketService.requestFriend(this.friend ?? "");
    this.friend = null;
  }

  public onDelete(){
    this.socketService.deleteFriend(this.friend ?? "");
    this.friend = null;
  }

}

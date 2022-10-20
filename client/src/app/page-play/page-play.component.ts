import { Component, OnInit } from '@angular/core';
import {SocketService} from "../_services/socket.service";

@Component({
  selector: 'app-page-play',
  templateUrl: './page-play.component.html',
  styleUrls: ['./page-play.component.css']
})
export class PagePlayComponent implements OnInit {
  form = {
    time: null,
    id: null
  }
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
  }

  onCreateCustom(){
    if(this.form.time === null){
      return
    }

    this.socketService.createCustom(Math.floor(+this.form.time));
  }

  onJoinCustom(){
    if(this.form.id === null){
      return
    }
    this.socketService.joinCustom(this.form.id);

  }

  onCreateFriend() {
    if(this.form.id === null){
      return
    }
    this.socketService.createFriendGame(this.form.id);
  }
}

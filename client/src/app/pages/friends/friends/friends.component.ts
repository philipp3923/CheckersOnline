import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../core/services/socket.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {
  }

}

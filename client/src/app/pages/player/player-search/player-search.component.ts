import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Event} from "@angular/router";
import {UserModel} from "../../../models/user.model";
import UserInfoModel from "../../../models/user-info.model";
import {ApiService} from "../../../core/services/api.service";
import {BehaviorSubject, debounceTime, skip} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {Socket} from "socket.io-client";
import {SocketService} from "../../../core/services/socket.service";

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent implements OnInit {

  filteredInput: BehaviorSubject<string>;

  results: UserInfoModel[];

  constructor(private apiService: ApiService, public userService: UserService, private socketService: SocketService) {
    this.results = [];
    this.filteredInput = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    this.filteredInput.pipe(
      skip(1),
      debounceTime(400)
    ).subscribe(async (next:string) => {
      await this.search(next);
    });
  }

  async search(query: string) {
    if(query.length <= 0){
      this.results = [];
      return;
    }
    this.results = (await this.apiService.findUserByUsername(query)).user;
  }

  public requestFriend(id : string){
    this.socketService.requestFriend(id, (args) => {
        console.log(args);
    });
  }

}

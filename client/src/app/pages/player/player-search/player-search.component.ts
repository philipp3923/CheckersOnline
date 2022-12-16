import {Component, OnInit} from '@angular/core';
import UserInfoModel from "../../../models/user-info.model";
import {ApiService} from "../../../core/services/api.service";
import {BehaviorSubject, debounceTime, skip} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {SocketService} from "../../../core/services/socket.service";
import {FriendsService} from "../../../core/services/friends.service";

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent implements OnInit {

  filteredInput: BehaviorSubject<string>;

  results: UserInfoModel[];
  query: boolean;

  constructor(private apiService: ApiService, public userService: UserService, private socketService: SocketService, public friendService: FriendsService) {
    this.results = [];
    this.query = false;
    this.filteredInput = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    this.filteredInput.pipe(
      skip(1),
      debounceTime(400)
    ).subscribe(async (next: string) => {
      await this.search(next);
    });
  }

  async search(query: string) {
    if (query.length <= 0) {
      this.results = [];
      this.query = false;
      return;
    }
    this.results = (await this.apiService.findUserByUsername(query)).user;
    this.query = true;
  }
}

import {Component, Input, OnInit} from '@angular/core';
import UserInfoModel from "../../../models/user-info.model";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../core/services/api.service";
import GameModel from "../../../models/game.model";

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {

  userInfo: UserInfoModel | undefined;
  userGames: GameModel[];
  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.userGames = [];
    route.params.subscribe(next => this.changeUser(next["id"]));

  }

  private async changeUser(id: string){
    this.userInfo = await this.apiService.getUser(id);
    this.userGames = await this.apiService.getFinishedGamesOfUser(id);
  }

  ngOnInit(): void {
  }

}

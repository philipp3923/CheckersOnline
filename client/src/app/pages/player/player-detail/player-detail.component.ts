import {Component, OnInit} from '@angular/core';
import UserInfoModel from "../../../models/user-info.model";
import {ActivatedRoute, Router} from "@angular/router";
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

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.userGames = [];
    route.params.subscribe(next => this.changeUser(next["id"]));

  }

  ngOnInit(): void {
  }

  private async changeUser(id: string) {
    try {
      this.userInfo = await this.apiService.getUser(id);
      this.userGames = await this.apiService.getFinishedGamesOfUser(id);
    } catch (e) {
      await this.router.navigate(["404"]);
    }

  }

}

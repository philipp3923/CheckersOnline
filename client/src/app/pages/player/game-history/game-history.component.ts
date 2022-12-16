import {Component, Input, OnInit} from '@angular/core';
import GameModel from "../../../models/game.model";
import {ApiService} from "../../../core/services/api.service";
import {Router} from "@angular/router";
import UserInfoModel from "../../../models/user-info.model";

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css']
})
export class GameHistoryComponent implements OnInit {

  gamesWithEnemy: { game: GameModel, enemy: UserInfoModel | null }[];

  constructor(private apiService: ApiService, public router: Router) {
    this.gamesWithEnemy = [];
    this._user_id = "";
  }

  private _user_id: string;

  @Input() set user_id(value: string) {
    this._user_id = value;
    this.ngOnInit();
  }

  ngOnInit(): void {
    if (this._user_id === "") {
      return;
    }
    this.retrieveGames().then();
  }

  isWinner(game: GameModel) {
    return game.winner === (game.white === this._user_id ? "WHITE" : "BLACK");
  }

  async getGamesWithEnemy() {

  }

  async getEnemy(game: GameModel) {
    try {
      return (await this.apiService.getUser(game.white === this._user_id ? game.black : game.white));
    } catch (e) {
      return null;
    }
  }

  getEnemyID(game: GameModel) {
    return game.white === this._user_id ? game.black : game.white;
  }

  getTimeString(time: number) {
    const date = new Date(time);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  private async retrieveGames() {
    //console.log(this._user_id);
    this.gamesWithEnemy = [];
    const games: GameModel[] = await this.apiService.getFinishedGamesOfUser(this._user_id);
    for (let game of games) {
      this.gamesWithEnemy.push({game: game, enemy: await this.getEnemy(game)});
    }
  }
}

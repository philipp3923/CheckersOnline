import {Component, Input, OnInit} from '@angular/core';
import GameModel from "../../../models/game.model";
import {ApiService} from "../../../core/services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css']
})
export class GameHistoryComponent implements OnInit {

  @Input() games: GameModel[];
  @Input() user_id: string;

  constructor(private apiService: ApiService, public router: Router) {
    this.games = [];
    this.user_id = "";
  }

  ngOnInit(): void {
  }

  isWinner(game: GameModel){
    return game.winner === (game.white === this.user_id? "WHITE" : "BLACK");
  }

  async getEnemyUsername(game: GameModel){
    return (await this.apiService.getUser(game.white === this.user_id? game.black : game.white)).username;
  }

  getEnemyID(game: GameModel){
    return game.white === this.user_id? game.black : game.white;
  }

  getTimeString(time: number){
    const date = new Date(time);
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }
}

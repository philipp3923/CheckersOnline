import {Component, OnInit} from '@angular/core';
import {GameService} from "../../../core/services/game.service";
import GameStateModel, {WaitingStateModel} from "../../../models/gamestate.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-active-games-overview',
  templateUrl: './active-games-overview.component.html',
  styleUrls: ['./active-games-overview.component.css']
})
export class ActiveGamesOverviewComponent implements OnInit {

  public games: Observable<{ [p: string]: GameStateModel | WaitingStateModel }>;
  public waitingGames: WaitingStateModel[];
  public activeGames: GameStateModel[];

  constructor(private gameService: GameService, public router: Router) {
    this.waitingGames = [];
    this.activeGames = [];
    this.games = gameService.getGamesObserver();
    this.games.subscribe({
      next: dict => {
        this.waitingGames = [];
        this.activeGames = [];
        for (const key of Object.keys(dict)) {
          if (dict[key].waiting) {
            this.waitingGames.push(<WaitingStateModel>dict[key]);
          } else {
            this.activeGames.push(<GameStateModel>dict[key]);
          }
        }
      }
    })
  }

  ngOnInit(): void {
  }
}

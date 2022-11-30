import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../core/services/game.service";
import GameStateModel from "../../../models/gamestate.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-active-games-overview',
  templateUrl: './active-games-overview.component.html',
  styleUrls: ['./active-games-overview.component.css']
})
export class ActiveGamesOverviewComponent implements OnInit {

  public games: Observable<{[p: string]: GameStateModel | null}>;
  public infos: {key: string}[];

  constructor(private gameService: GameService) {
    this.infos = [];
    this.games = gameService.getGamesObserver();
    this.games.subscribe({next: dict => {
      console.log(dict);
      this.infos = [];
      for(const key of Object.keys(dict)){
          let info = {key: key};
          if(dict[key] != null){
            //TODO add more information to active games
          }
          this.infos.push(info);
        }
      }
    })
  }

  ngOnInit(): void {
  }
}

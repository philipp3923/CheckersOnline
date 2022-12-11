import {Component, OnInit, ViewChild} from '@angular/core';
import {GameService} from "../../../core/services/game.service";
import GameStateModel, {WaitingStateModel} from "../../../models/gamestate.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {TimerComponent} from "../../game/timer/timer.component";
import {UserService} from "../../../core/services/user.service";
import {DYN_INC_MAP, DYN_TIME_MAP, STAT_TIME_MAP} from "../play/play.component";

@Component({
  selector: 'app-active-games-overview',
  templateUrl: './active-games-overview.component.html',
  styleUrls: ['./active-games-overview.component.css']
})
export class ActiveGamesOverviewComponent implements OnInit {

  public games: Observable<{ [p: string]: GameStateModel | WaitingStateModel }>;
  public waitingGames: WaitingStateModel[];
  public activeGames: GameStateModel[];
  @ViewChild("timerComponent") public timer: TimerComponent | undefined;
  public DYN_TIME_MAP: string[];
  public DYN_INC_MAP: string[];
  public STAT_TIME_MAP: string[];

  constructor(private gameService: GameService, public router: Router, private userService: UserService) {
    this.waitingGames = [];
    this.activeGames = [];
    this.DYN_TIME_MAP = DYN_TIME_MAP;
    this.DYN_INC_MAP = DYN_INC_MAP;
    this.STAT_TIME_MAP = STAT_TIME_MAP;
    const games = this.gameService.getGames();
    for (const key of Object.keys(games)) {
      if (games[key].waiting) {
        this.waitingGames.push(<WaitingStateModel>games[key]);
      } else {
        this.activeGames.push(<GameStateModel>games[key]);
      }
    }

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

  public getPlayerTerm(gameState: GameStateModel, color: number){
    let player = null;
    if(color === 1){
      player = gameState.white;
    } else if(color === -1){
      player = gameState.black;
    }else{
      throw new Error("Illegal color submitted");
    }

    if(player.id === this.userService.getUser().id){
      return "YOU"
    }else{
      return "GUEST"
    }
  }

  ngOnInit(): void {
  }
}

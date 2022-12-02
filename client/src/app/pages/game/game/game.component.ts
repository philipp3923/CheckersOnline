import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../../core/services/game.service";
import GameStateModel, {WaitingStateModel} from "../../../models/gamestate.model";
import {BoardComponent} from "../board/board.component";
import PositionModel from "../../../models/position.model";
import {UserService} from "../../../core/services/user.service";
import {SocketService} from "../../../core/services/socket.service";
import {Subscription} from "rxjs";
import {TimerComponent} from "../timer/timer.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  public game: GameStateModel | WaitingStateModel | null;
  public black: { nick: string, time_left: string } | undefined;
  public white: { nick: string, time_left: string } | undefined;
  @ViewChild("board") board: BoardComponent | undefined;
  @ViewChild("player_timer") white_timer: TimerComponent | undefined;
  @ViewChild("enemy_timer") black_timer: TimerComponent | undefined;
  private key: string;
  private my_color: number;
  private possible_inputs: number[];
  private view: boolean;
  private gameSubscription: Subscription | undefined;

  constructor(private socketService: SocketService, private route: ActivatedRoute, private gameService: GameService, private router: Router, private userService: UserService) {
    this.key = "";
    this.gameSubscription = undefined;
    this.view = false;
    this.game = null;
    this.my_color = 0;
    this.possible_inputs = [];
    this.route.params.subscribe(params => this.onRouteChange(params["key"]));
  }

  onRouteChange(gameKey: string) {
    if (this.gameService.getGame(gameKey)) {
      this.init(gameKey);
      return
    }
    this.socketService.joinCustomGame(gameKey, (res) => {
      if (!res.success) {
        if (this.gameService.getGame(gameKey)) {
          this.init(gameKey);
          return
        }
        this.router.navigate(["/play"]);
        return;
      }
      const checkGameLoadedInterval = setInterval(() => {
        this.game = this.gameService.getGame(gameKey);
        if (this.game) {
          this.init(gameKey);
          clearInterval(checkGameLoadedInterval);

        }
      }, 50);
    });
  }

  init(key: string) {
    this.gameSubscription?.unsubscribe();
    this.key = key;
    this.game = this.gameService.getGame(this.key);
    if (!this.game) {
      return;
    }
    if (this.view && !this.game.waiting) {
      this.start(this.game);
    }
    this.gameSubscription = this.gameService.getGameObserver(this.key)?.subscribe({next: (game) => this.update(game)});
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.view = true;
    this.board?.clickObserver.subscribe({next: (pos) => this.input(pos)});
    if (this.game !== null && !this.game.waiting) {
      this.start(this.game);
    }
  }

  private start(game: GameStateModel) {
    this.my_color = game.black.id === this.userService.getUser().id ? -1 : 1;
    this.board?.setState(game?.board);
    this.game = game;
    setTimeout(()=>{
      this.black_timer?.setTime(game.black.time);
      this.white_timer?.setTime(game.white.time);
      if(game.plays.length > 0){
        const deltaTime = Date.now() - game.timestamp;
        if(game.nextColor === 1)
        {
          this.white_timer?.countDown(game.white.time - deltaTime);
        }else if(game.nextColor === -1){
          this.black_timer?.countDown(game.black.time-deltaTime);
        }
      }
    },100);
    this.board?.refresh();
  }

  private update(game: GameStateModel | WaitingStateModel | null) {
    if (this.game?.key !== game?.key) {
      return;
    }
    console.log(game?.nextColor);

    if (!game) {
      this.router.navigate(["/play"]);
      return;
    }
    if (game?.waiting) {
      return;
    }
    game = <GameStateModel>game;

    this.white_timer?.stopCountDown();
    this.black_timer?.stopCountDown();

    const deltaTime = Date.now() - game.timestamp;

    if (game.plays.length > 0) {
      if (game.nextColor === 1) {
        this.white_timer?.countDown(game.white.time - deltaTime);
        this.black_timer?.setTime(game.black.time);
      } else if (game.nextColor === -1) {
        this.black_timer?.countDown(game.black.time - deltaTime);
        this.white_timer?.setTime(game.white.time);
      } else {
        this.black_timer?.setTime(game.black.time);
        this.white_timer?.setTime(game.white.time);
        return;
      }
    }

    console.log("FRESH")
    console.table(this.board?.getState());
    console.log("SHOUD");
    console.table(game.board);
    if (game.plays.length <= 0) {
      this.start(game);
    } else {
      const play = game.plays[game.plays.length - 1];
      this.board?.move(play.start, play.target, play.capture);

    }
    this.game = game;
  }

  private input(pos: PositionModel) {
    if (this.game?.nextColor !== this.my_color) {
      return;
    }
    const index = this.getInputIndex(pos);
    if (this.possible_inputs.length > 0 && index !== null) {
      this.socketService.playMove(this.game.key, index);
      this.possible_inputs = [];
    } else {
      this.findPossibleInputs(pos);
      this.board?.select(pos, this.getPossibleInputs());
      return;
    }
  }

  private getInputIndex(pos: PositionModel) {
    for (let i of this.possible_inputs) {
      const target = (<GameStateModel>this.game).possibleTurns[i].target;
      if (target.x === pos.x && target.y === pos.y) {
        return i;
      }
    }
    return null;
  }

  private getPossibleInputs() {
    const result = [];
    for (let i of this.possible_inputs) {
      result.push((<GameStateModel>this.game).possibleTurns[i].target);
    }
    return result;
  }

  private findPossibleInputs(pos: PositionModel) {
    this.possible_inputs = [];
    if (typeof (<GameStateModel>this.game).possibleTurns === "undefined") throw new Error("trying to get moves on" +
      " inactive game.");

    for (let i = 0; i < (<GameStateModel>this.game).possibleTurns.length; i++) {
      const play = (<GameStateModel>this.game).possibleTurns[i];
      if (play.start.x === pos.x && play.start.y === pos.y) {
        this.possible_inputs.push(i);
      }
    }
  }


}

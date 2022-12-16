import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/services/api.service";
import GameModel from "../../../models/game.model";
import {BoardComponent} from "../board/board.component";
import {DYN_INC_MAP, DYN_TIME_MAP, STAT_TIME_MAP} from "../../play/play/play.component";
import {TimerComponent} from "../timer/timer.component";
import UserInfoModel from "../../../models/user-info.model";

@Component({
  selector: 'app-view-game', templateUrl: './view-game.component.html', styleUrls: ['./view-game.component.css']
})
export class ViewGameComponent implements OnInit, AfterViewInit {
  public game: GameModel | null;
  @ViewChild("board") board: BoardComponent | undefined;
  @ViewChild("black_timer") blackTimer: TimerComponent | undefined;
  @ViewChild("white_timer") whiteTimer: TimerComponent | undefined;
  public blackPlayer: UserInfoModel | undefined;
  public whitePlayer: UserInfoModel | undefined;
  public DYN_TIME_MAP: string[];
  public DYN_INC_MAP: string[];
  public STAT_TIME_MAP: string[];
  private currentMoveIndex: number;
  private states: number[][][];
  private blackTimes: number[];
  private whiteTimes: number[];

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
    this.DYN_TIME_MAP = DYN_TIME_MAP;
    this.DYN_INC_MAP = DYN_INC_MAP;
    this.STAT_TIME_MAP = STAT_TIME_MAP;
    this.game = null;
    this.currentMoveIndex = 0;
    this.blackTimes = [];
    this.whiteTimes = [];
    this.states = [[[0, -1, 0, -1, 0, -1, 0, -1], [-1, 0, -1, 0, -1, 0, -1, 0], [0, -1, 0, -1, 0, -1, 0, -1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0]]];
    route.params.subscribe((params) => {
      this.initView(params["id"]).then();
    });
  }

  async initView(id: string) {
    try {
      this.game = await this.apiService.getFinishedGame(id);
      this.cacheStates();
      this.setTimes();
    } catch (e) {
      await this.router.navigate([]);
      return;
    }
    try {
      this.blackPlayer = await this.apiService.getUser(this.game.black);
    } catch (e) {

    }
    try {
      this.whitePlayer = await this.apiService.getUser(this.game.white);
    } catch (e) {

    }
  }

  nextMove() {
    if (!this.game) {
      return;
    }
    if (((this.game.plays?.length ?? 0) <= this.currentMoveIndex) || !this.game.plays) {
      return;
    }
    const currentMove = this.game.plays[this.currentMoveIndex];
    console.table(this.states[this.currentMoveIndex]);
    this.board?.move(currentMove.start, currentMove.target, currentMove.capture);
    console.log(currentMove);
    this.currentMoveIndex++;
    this.setTimes();
    /*this.board?.setState(this.copyState(this.states[this.currentMoveIndex]));
    this.board?.refresh()*/
  }

  previousMove() {
    if (this.currentMoveIndex <= 0) {
      return;
    }
    this.currentMoveIndex--;
    this.board?.setState(this.copyState(this.states[this.currentMoveIndex]));
    this.board?.refresh();
    this.setTimes();
  }

  jumpStart() {
    this.board?.reset();
    this.board?.refresh();
    this.currentMoveIndex = 0;
    this.setTimes();
  }

  jumpEnd() {
    if (!this.game?.plays) {
      return;
    }
    this.currentMoveIndex = this.game.plays.length;
    this.setTimes();
    this.board?.setState(this.copyState(this.states[this.currentMoveIndex]));
    this.board?.refresh();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.board?.reset();
    this.board?.refresh();
  }

  getTimeString(time: number) {
    const date = new Date(time);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  private setTimes() {
    this.blackTimer?.setTime(this.blackTimes[this.currentMoveIndex]);
    this.whiteTimer?.setTime(this.whiteTimes[this.currentMoveIndex]);
  }

  private copyState(state: number[][]) {
    return state.map(x => x.map(x => x));
  }

  private cacheStates() {
    if (!this.game?.plays) {
      return;
    }

    this.blackTimes.push(this.game.timeLimit ?? 0);
    this.whiteTimes.push(this.game.timeLimit ?? 0);
    for (const play of this.game.plays) {
      const newState = this.copyState(this.states[this.states.length - 1]);

      if (play.color === "BLACK") {
        this.blackTimes.push(play.time_left ?? 0);
        this.whiteTimes.push(this.whiteTimes[this.whiteTimes.length - 1]);
      }
      if (play.color === "WHITE") {
        this.whiteTimes.push(play.time_left ?? 0);
        this.blackTimes.push(this.blackTimes[this.blackTimes.length - 1]);
      }

      if (play.capture) {
        newState[play.target.y - ((play.target.y - play.start.y) / 2.0)][play.target.x - ((play.target.x - play.start.x) / 2.0)] = 0;
      }

      newState[play.target.y][play.target.x] = newState[play.start.y][play.start.x];
      newState[play.start.y][play.start.x] = 0;

      if (newState[play.target.y][play.target.x] > 0 && play.target.y == 0 || newState[play.target.y][play.target.x] < 0 && play.target.y == 7) {
        newState[play.target.y][play.target.x] *= 2;
      }

      this.states.push(newState);
    }
    console.log(this.states.length);
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../../core/services/api.service";
import GameModel from "../../../models/game.model";
import {BoardComponent} from "../board/board.component";

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.css']
})
export class ViewGameComponent implements OnInit, AfterViewInit {
  public game: GameModel | null;
  private currentMoveIndex: number;
  private states: number[][][];
  @ViewChild("board") board: BoardComponent | undefined;
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
    this.game = null;
    this.currentMoveIndex = 0;
    this.states= [[
        [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]]
    ];
    route.params.subscribe((params)=>{
      this.initView(params["id"]).then();
    });
  }

  async initView(id: string){
      try{
        this.game = await this.apiService.getFinishedGame(id);
        this.cacheStates();
        console.log(this.game);
      }catch (e) {
        await this.router.navigate([]);
        return;
      }
  }

  private copyState(state: number[][]){
    return state.map(x=>x.map(x=>x));
  }

  private cacheStates(){
    if(!this.game?.plays){
      return;
    }
    for(const play of this.game.plays){
      const newState = this.copyState(this.states[this.states.length-1]);

      if(play.capture){
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

  nextMove(){
    if(!this.game){
      return;
    }
    if(((this.game.plays?.length ?? 0) <= this.currentMoveIndex) ||!this.game.plays){
      return;
    }
    const currentMove = this.game.plays[this.currentMoveIndex];
    console.table(this.states[this.currentMoveIndex]);
    this.board?.move(currentMove.start, currentMove.target, currentMove.capture);
    console.log(currentMove);
    this.currentMoveIndex++;
    /*this.board?.setState(this.copyState(this.states[this.currentMoveIndex]));
    this.board?.refresh()*/

  }

  previousMove(){
    if(this.currentMoveIndex <= 0){
      return;
    }
    this.currentMoveIndex--;
    this.board?.setState(this.copyState(this.states[this.currentMoveIndex]));
    this.board?.refresh();
  }

  jumpStart(){
    this.board?.reset();
    this.board?.refresh();
    this.currentMoveIndex = 0;
  }

  jumpEnd(){
    if(!this.game?.plays){
      return;
    }
    this.currentMoveIndex = this.game.plays.length-1;
    this.board?.setState(this.copyState(this.states[this.currentMoveIndex]));
    this.board?.refresh();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.board?.reset();
    this.board?.refresh();
  }

}

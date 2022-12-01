import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";
import GameStateModel, {WaitingStateModel} from "../../models/gamestate.model";
import {Observable, of, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private games: { [key: string]: GameStateModel | WaitingStateModel };
  private games_subjects: {[key: string]: Subject<GameStateModel |WaitingStateModel>};
  private gamesSubject: Subject<{ [key: string]: GameStateModel | WaitingStateModel }>;

  constructor(private socketService: SocketService) {
    this.games = {};
    this.games_subjects = {};
    this.gamesSubject = new Subject<{[p: string]: GameStateModel | WaitingStateModel}>();
    this.socketService.addGameStateListener((gameState: GameStateModel)=>this.updateGameState(gameState));
  }

  public addWaitingGame(key: string, timeType: number, time: number, increment: number){
    this.games[key] = <WaitingStateModel>{key: key, time: time, timeType: timeType, increment: increment, waiting: true};
    this.games_subjects[key] = new Subject<GameStateModel | WaitingStateModel>();
    this.games_subjects[key].next(this.games[key]);
    this.gamesSubject.next(this.games);
  }

  public getGamesObserver(): Observable<{ [key: string]: GameStateModel | WaitingStateModel }>{
    return this.gamesSubject.asObservable();
  }

  public getGameObserver(key: string): Observable<GameStateModel |WaitingStateModel> | null{
    if(!this.games_subjects[key]) return null;
    return this.games_subjects[key].asObservable();
  }

  public getGame(key: string){
    return this.games[key] ?? null;
  }

  private updateGameState(gameState: GameStateModel) {
    this.games[gameState.key] = gameState;
    this.gamesSubject.next(this.games);
    if(!this.games_subjects[gameState.key]){
      this.games_subjects[gameState.key] = new Subject<GameStateModel | WaitingStateModel>();
    }
    this.games_subjects[gameState.key].next(gameState);
  }
}

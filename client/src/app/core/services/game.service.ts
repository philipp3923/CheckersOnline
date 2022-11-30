import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";
import GameStateModel from "../../models/gamestate.model";
import {Observable, of, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private games: { [key: string]: GameStateModel | null };
  private gamesSubject: Subject<{ [key: string]: GameStateModel | null }>;

  constructor(private socketService: SocketService) {
    this.games = {};
    this.gamesSubject = new Subject<{[p: string]: GameStateModel | null}>();
    this.socketService.addGameStateListener((gameState: GameStateModel)=>this.updateGameState(gameState));
  }

  public addWaitingGame(key: string){
    this.games[key] = null;
    this.gamesSubject.next(this.games);
  }

  public getGamesObserver(){
    return this.gamesSubject.asObservable();
  }

  private updateGameState(gameState: GameStateModel) {
    this.games[gameState.key] = gameState;
    this.gamesSubject.next(this.games);
  }
}

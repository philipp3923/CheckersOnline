import {Injectable} from '@angular/core';
import {SocketService} from "./socket.service";
import GameStateModel, {WaitingStateModel} from "../../models/gamestate.model";
import {Observable, Subject} from "rxjs";

const GAMES_KEY = "games";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private games: { [key: string]: GameStateModel | WaitingStateModel };
  private games_subjects: { [key: string]: Subject<GameStateModel | WaitingStateModel> };
  private gamesSubject: Subject<{ [key: string]: GameStateModel | WaitingStateModel }>;

  constructor(private socketService: SocketService) {
    this.games = {};
    this.games_subjects = {};
    this.gamesSubject = new Subject<{ [p: string]: GameStateModel | WaitingStateModel }>();
    this.socketService.addGameStateListener((gameState: GameStateModel) => this.updateGameState(gameState));
    this.socketService.addWelcomeListener((res: any) => this.load(res.games));
    this.socketService.addGameLeaveListener((res: any) => this.removeGame(res.key));
  }

  public addWaitingGame(key: string, timeType: number, time: number, increment: number) {
    this.games[key] = <WaitingStateModel>{
      key: key,
      time: time,
      timeType: timeType,
      increment: increment,
      waiting: true
    };
    this.games_subjects[key] = new Subject<GameStateModel | WaitingStateModel>();
    this.games_subjects[key].next(this.games[key]);
    this.gamesSubject.next(this.games);
  }

  public getGamesObserver(): Observable<{ [key: string]: GameStateModel | WaitingStateModel }> {
    return this.gamesSubject.asObservable();
  }

  public getGameObserver(key: string): Observable<GameStateModel | WaitingStateModel> | null {
    if (!this.games_subjects[key]) return null;
    return this.games_subjects[key].asObservable();
  }

  public getGame(key: string) {
    return this.games[key] ?? null;
  }

  public removeGame(key: string) {
    delete this.games[key];
    this.gamesSubject.next(this.games);
    this.games_subjects[key].complete();
  }

  public getGames() {
    return this.games;
  }

  private updateGameState(gameState: GameStateModel) {
    this.games[gameState.key] = gameState;
    this.gamesSubject.next(this.games);
    if (!this.games_subjects[gameState.key]) {
      this.games_subjects[gameState.key] = new Subject<GameStateModel | WaitingStateModel>();
    }
    this.games_subjects[gameState.key].next(gameState);

    if (gameState.winner) {
      delete this.games[gameState.key];
      delete this.games_subjects[gameState.key];
      this.gamesSubject.next(this.games);
    }

  }

  /**
   * useless
   * @private
   */
  private save() {
    window.sessionStorage.setItem(GAMES_KEY, JSON.stringify(this.games));
  }

  private load(games: { [key: string]: GameStateModel | WaitingStateModel }) {
    this.games = games;
    for (let key of Object.keys(this.games)) {
      this.games_subjects[key] = new Subject<GameStateModel | WaitingStateModel>();
    }
    this.gamesSubject.next(this.games);
  }
}

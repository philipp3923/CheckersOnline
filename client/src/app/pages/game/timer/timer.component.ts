import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import GameStateModel from "../../../models/gamestate.model";
import {GameService} from "../../../core/services/game.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, AfterContentInit {
  time: string;
  @Input() gameKey: string | undefined;
  @Input() colorToDisplay: number | undefined;
  private active: boolean;
  private interval: any;

  constructor(private gameService: GameService) {
    this.time = "";
    this.active = false;
  }

  private static addZeroPadding(num: number) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }

  ngAfterContentInit() {
    if (!this.gameKey || !this.colorToDisplay) {
      return;
    }
    const game = this.gameService.getGame(this.gameKey);
    const observable = this.gameService.getGameObserver(this.gameKey);
    if (!game || !observable) {
      throw new Error("Game with given key does not exist");
    }

    if (!game.waiting) {
      this.observeGame(this.colorToDisplay, game);
    }
    observable.subscribe((gameState) => {
      if (!game.waiting) {
        this.observeGame(this.colorToDisplay ?? 0, game);
      }
    });

  }

  public setTime(timeInMilliseconds: number) {
    if (timeInMilliseconds <= 0) {
      this.time = "00:00,00";
    }

    const days = Math.floor(timeInMilliseconds / 86400000);
    const hours = Math.floor((timeInMilliseconds / 3600000)) - days * 24;
    const minutes = Math.floor((timeInMilliseconds / 60000)) - hours * 60 - days * 24 * 60;
    const seconds = Math.floor((timeInMilliseconds / 1000)) - minutes * 60 - hours * 3600 - days * 24 * 3600;
    const tenthOfSeconds = Math.floor(timeInMilliseconds / 10) % 100;

    if (days > 0) {
      this.time = days + "D, " + hours + "H";
      return;
    }

    if (hours > 0) {
      this.time = TimerComponent.addZeroPadding(hours) + ":" + TimerComponent.addZeroPadding(minutes) + ":" + TimerComponent.addZeroPadding(seconds);
      return
    }

    this.time = TimerComponent.addZeroPadding(minutes) + ":" + TimerComponent.addZeroPadding(seconds) + "," + TimerComponent.addZeroPadding(tenthOfSeconds);
  }

  public stopCountDown() {
    clearInterval(this.interval);
  }

  public countDown(timeInMilliseconds: number) {
    this.interval = setInterval(() => {
      timeInMilliseconds -= 50;
      this.setTime(timeInMilliseconds)
    }, 50);
  }

  ngOnInit(): void {
  }

  private observeGame(color: number, gameState: GameStateModel) {
    const delta = Date.now() - gameState.timestamp;
    if (this.colorToDisplay === 1) {
      if (gameState.plays.length > 0 && gameState.nextColor === 1) {
        this.countDown(gameState.white.time - delta);
      }
      this.setTime(gameState.white.time);
    }
    if (this.colorToDisplay === -1) {
      if (gameState.plays.length > 0 && gameState.nextColor === -1) {
        this.countDown(gameState.black.time - delta);
      }
      this.setTime(gameState.black.time);
    }
  }

}

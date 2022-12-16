import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../../../core/services/socket.service";
import {GameService} from "../../../core/services/game.service";
import {Router} from "@angular/router";
import {MessageService, MessageType} from "../../../core/services/message.service";

export const STAT_TIME_MAP = ["1 Minute", "5 Minutes", "10 Minutes", "30 Minutes", "1 Hour", "1 Day"];
export const DYN_TIME_MAP = ["10s", "30s", "1 Minute", "10 Minutes", "30 Minutes", "1 Hour"];
export const DYN_INC_MAP = ["none", "10 Seconds", "30 Seconds", "1 Minute", "10 Minutes"];

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public state: string;
  public type: number;
  public time: number;
  public increment: number;
  public DYN_TIME_MAP: string[];
  public DYN_INC_MAP: string[];
  public STAT_TIME_MAP: string[];

  @ViewChild("time_slider") public timeSlider: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("increment_slider") public incrementSlider: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("game_key") public game_keyInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private socketService: SocketService, private gameService: GameService, private router: Router, private messageService: MessageService) {
    this.type = 0;
    this.time = 2;
    this.increment = 2;
    this.state = "join_custom";
    this.DYN_TIME_MAP = DYN_TIME_MAP;
    this.DYN_INC_MAP = DYN_INC_MAP;
    this.STAT_TIME_MAP = STAT_TIME_MAP;
  }

  ngOnInit(): void {
  }

  switchJoinCasual() {
    this.state = "join_casual";
  }

  switchJoinCustom() {
    this.state = "join_custom";
  }

  switchCreateCustom() {
    this.state = "create_custom";
  }

  switchType(type: number) {
    switch (type) {
      case 0:
        //@ts-ignore
        this.timeSlider.nativeElement.max = this.STAT_TIME_MAP.length - 1;
        //@ts-ignore
        if (this.timeSlider.nativeElement.value >= this.STAT_TIME_MAP.length - 1) {

          this.time = STAT_TIME_MAP.length - 1;
          //@ts-ignore
          this.timeSlider.nativeElement.value = this.STAT_TIME_MAP.length - 1;

        }
        break
      case 1:
        //@ts-ignore
        this.timeSlider.nativeElement.max = this.DYN_TIME_MAP.length - 1;
        //@ts-ignore
        if (this.timeSlider.nativeElement.value >= this.DYN_TIME_MAP.length - 1) {
          this.time = DYN_TIME_MAP.length - 1;
          //@ts-ignore
          this.timeSlider.nativeElement.value = this.DYN_TIME_MAP.length - 1;

        }
        break
    }
    this.type = type;
  }

  updateTime() {
    this.time = +(this.timeSlider?.nativeElement.value ?? 0);
  }

  updateIncrement() {
    this.increment = +(this.incrementSlider?.nativeElement.value ?? 0);
  }

  enterGame() {
    const timeType = this.type;
    const time = this.time;
    const increment = this.increment;

    switch (this.state) {
      case "join_custom":
        const key = this.game_keyInput?.nativeElement.value.toUpperCase();
        if (!key) {
          this.messageService.addMessage(MessageType.WARNING, "Please enter a Game Key.");
          return;
        }
        this.socketService.joinCustomGame(key, (res) => {
          if (!res.success) {
            if (res.error === "Game does not exist") {
              this.messageService.addMessage(MessageType.ERROR, "A Game with the given Key does not exist.");
            } else if (res.error === "Exceeded amount of possible simultaneous games") {
              this.messageService.addMessage(MessageType.ERROR, "You have reached the maximum amount of simultaneous" +
                " games (20).");
            } else {
              this.messageService.addMessage(MessageType.ERROR, "You are not allowed to join this game.");
            }
            return;
          }
          if (!this.gameService.getGame(key)) {
            this.gameService.addWaitingGame(key, 0, 0, 0);
          }
          this.router.navigate(["/play/" + key]).then();
        });
        break
      case "join_casual":
        this.socketService.joinCasualGame(this.type === 1, this.time, this.increment, (res) => {
          if (!res.success) {
            this.messageService.addMessage(MessageType.ERROR, "We are sorry, this feature has yet to be implemented.");
            return;
          }
          this.gameService.addWaitingGame(res.key, timeType, time, increment);
          this.router.navigate(["/play/" + res.key]).then();
        });
        break
      case "create_custom":
        this.socketService.createCustomGame(this.type === 1, this.time, this.increment, (res) => {
          if (!res.success) {
            this.messageService.addMessage(MessageType.ERROR, "You have reached the maximum amount of simultaneous" +
              " games (20).");
            return;
          }
          this.gameService.addWaitingGame(res.key, timeType, time, increment);
          this.router.navigate(["/play/" + res.key]).then();
        });
        break
    }
  }
}

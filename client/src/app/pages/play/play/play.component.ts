import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "../../../core/services/socket.service";
import {GameService} from "../../../core/services/game.service";
import {Router} from "@angular/router";


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

  @ViewChild("time_slider") public timeSlider: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("increment_slider") public incrementSlider: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("game_key") public game_keyInput: ElementRef<HTMLInputElement> |undefined;

  STAT_TIME_MAP = ["1 Minute", "5 Minutes", "10 Minutes", "30 Minutes", "1 Hour", "1 Day", "30 Days"];
  DYN_TIME_MAP = ["10s", "30s", "1 Minute", "10 Minutes", "30 Minutes", "1 Hour"];
  DYN_INC_MAP = ["none", "10 Seconds", "30 Seconds", "1 Minute", "10 Minutes"];

  constructor(private socketService: SocketService, private gameService: GameService, private router: Router) {
    this.type = 0;
    this.time = 2;
    this.increment = 2;
    this.state = "join_custom";
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
        if(this.timeSlider.nativeElement.value >= this.STAT_TIME_MAP.length - 1){

          this.time = this.STAT_TIME_MAP.length - 1;
          //@ts-ignore
          this.timeSlider.nativeElement.value = this.STAT_TIME_MAP.length - 1;

        }
        break
      case 1:
        //@ts-ignore
        this.timeSlider.nativeElement.max = this.DYN_TIME_MAP.length - 1;
        //@ts-ignore
        if(this.timeSlider.nativeElement.value >= this.DYN_TIME_MAP.length - 1){
          this.time = this.DYN_TIME_MAP.length - 1;
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

    switch (this.state){
      case "join_custom":
        const key = this.game_keyInput?.nativeElement.value.toUpperCase();
        if(!key) return;
        this.socketService.joinCustomGame(key, (res)=>{
          console.log(res);
          if(!res.success){
            return;
          }
          if(!this.gameService.getGame(key)){
            this.gameService.addWaitingGame(key,0,0,0);
          }
          this.router.navigate(["/game/"+key]);
        });
        break
      case "join_casual":
        this.socketService.joinCasualGame(this.type===1, this.time, this.increment, (res)=>{
          console.log(res);
          if(!res.success){
            return;
          }
          this.gameService.addWaitingGame(res.key,timeType,time,increment);
          this.router.navigate(["/game/"+res.key]);
        });
        break
      case "create_custom":
        this.socketService.createCustomGame(this.type===1, this.time, this.increment, (res)=>{
          console.log(res);
          if(!res.success){
            return;
          }
          this.gameService.addWaitingGame(res.key,timeType,time,increment);
          this.router.navigate(["/game/"+res.key]);
        });
        break
    }
  }
}

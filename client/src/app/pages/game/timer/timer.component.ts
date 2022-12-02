import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  time: string;
  private active: boolean;
  private interval: any;

  constructor() {
    this.time ="";
    this.active = false;
  }

  public setTime(timeInMilliseconds: number){
    const days = Math.floor(timeInMilliseconds / 86400000);
    const hours =  Math.floor((timeInMilliseconds / 3600000))-days*24;
    const minutes = Math.floor((timeInMilliseconds / 60000))-hours*60;
    const seconds = Math.floor((timeInMilliseconds/1000)) -minutes*60;
    const tenthOfSeconds = Math.floor(timeInMilliseconds/10)%100;

    if(days > 0){
      this.time = days + "D, "+hours+"H";
      return;
    }

    if(hours > 0){
      this.time = TimerComponent.addZeroPadding(hours) +":"+TimerComponent.addZeroPadding(minutes)+":"+TimerComponent.addZeroPadding(seconds)+","+TimerComponent.addZeroPadding(tenthOfSeconds);
      return
    }

    this.time = TimerComponent.addZeroPadding(minutes)+":"+TimerComponent.addZeroPadding(seconds)+","+TimerComponent.addZeroPadding(tenthOfSeconds);
  }

  private static addZeroPadding(num: number){
    if(num < 10){
      return "0"+num;
    }else{
      return ""+num;
    }
  }

  public stopCountDown(){
    clearInterval(this.interval);
  }

  public countDown(timeInMilliseconds: number){
    this.interval = setInterval(()=> {
      timeInMilliseconds-=50;
      this.setTime(timeInMilliseconds)
    },50);
  }

  ngOnInit(): void {
  }

}

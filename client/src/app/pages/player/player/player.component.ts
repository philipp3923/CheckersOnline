import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public showDetail: boolean;

  constructor(private route: ActivatedRoute) {
    this.showDetail = false;
    this.route.params.subscribe(params => this.onRouteChange(params["id"]));
  }

  ngOnInit(): void {
  }

  private onRouteChange(param: any) {
    if(param){
      this.showDetail = true;
    }else{
      this.showDetail = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../core/services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrls: ['./disconnected.component.css']
})
export class DisconnectedComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private socketService: SocketService) {
    if(this.socketService.isConnected()){
      this.router.navigate(["/"]);
    }

    this.socketService.isConnectedObserver().subscribe({
      next: (connected) => {
        if(connected){
          this.router.navigate(["/"]);
        }
      }
    })
  }

  ngOnInit(): void {
  }

}

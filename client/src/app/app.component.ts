import {Component} from '@angular/core';
import {UserService} from "./core/services/user.service";
import {SocketService} from "./core/services/socket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private userService: UserService, private socketService: SocketService, private router: Router) {
    let redirectTimeout: NodeJS.Timeout | undefined = undefined;
    let connectionWasLost = false;
    this.socketService.isConnectedObserver().subscribe({
      next: (connected) => {
        if(connected){
          clearTimeout(redirectTimeout);
          if(connectionWasLost){
            connectionWasLost = false;
          }
        }else{
         redirectTimeout = setTimeout(()=>{
            if(!socketService.isConnected()){
              this.router.navigate(["/disconnected"]);
              connectionWasLost = true;
            }
          },1000);
        }
      }
    })
  }

}

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


  public connected: boolean;
  constructor(private userService: UserService, private socketService: SocketService, private router: Router) {
    let redirectTimeout: NodeJS.Timeout | undefined = undefined;
    this.connected = true;
    this.socketService.isConnectedObserver().subscribe({
      next: (connected) => {
        if(connected){
          clearTimeout(redirectTimeout);
          if(!this.connected){
            this.connected = true;
            this.router.navigate(["/"]).then();
          }
        }else{
         redirectTimeout = setTimeout(()=>{
            if(!socketService.isConnected()){
              this.connected = false;
              this.router.navigate(["/disconnected"]).then();
            }
          },1000);
        }
      }
    })
  }

}

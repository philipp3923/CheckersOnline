import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";
import GameModel from "../../../models/game.model";
import {ApiService} from "../../../core/services/api.service";
import {MessageService, MessageType} from "../../../core/services/message.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username : string;
  id: string;
  email : string;
  userGames: GameModel[];

  constructor(private router: Router, private userService: UserService, private apiService: ApiService, private messageService: MessageService) {
    if(!this.userService.isUser()){
      this.router.navigate(["/login"]).then();
    }
    this.username = "";
    this.email = "";
    this.id="";
    this.userGames = [];

  }

  ngOnInit(): void {
    this.refresh().then();
  }

  async refresh(){
    const info = await  this.userService.getInfo();
    this.username = info.username;
    this.email = info.email;
    this.id = info.id;
    this.userGames = await this.apiService.getFinishedGamesOfUser(this.id);
  }

  async updateEmail(newEmail : string){
    const changeSuccess = await this.userService.changeEmail(newEmail);
    if(changeSuccess){
      await this.refresh();
      this.messageService.addMessage(MessageType.INFO, "Changed E-Mail.");
    }else{
      this.messageService.addMessage(MessageType.ERROR, "This E-Mail is not available.");
    }
  }

  async updateUsername(newUsername: string){
    const changeSuccess = await this.userService.changeUsername(newUsername);
    if(changeSuccess){
      await this.refresh();
      this.messageService.addMessage(MessageType.INFO, "Changed Username.");
    }else{
      this.messageService.addMessage(MessageType.ERROR, "This E-Username is not available.");
    }
  }

  async updatePassword(oldPassword: string, newPassword: string){
    const changeSuccess = await this.userService.changePassword(oldPassword, newPassword);
    if(changeSuccess){
      await this.refresh();
      this.messageService.addMessage(MessageType.INFO, "Changed Password.");

    }else{
      this.messageService.addMessage(MessageType.ERROR, "Wrong Password.");
    }
  }

  async deleteUser(password: string) {
    const deleteSuccess = await this.userService.deleteUser(password);
    if(deleteSuccess){
      await this.router.navigate([""]);
    }else{
      this.messageService.addMessage(MessageType.ERROR, "Something went wrong.");
    }
  }
}

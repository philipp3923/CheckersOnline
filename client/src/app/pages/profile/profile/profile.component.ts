import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username : string;
  email : string;

  constructor(private router: Router, private userService: UserService) {
    if(!this.userService.isUser()){
      this.router.navigate(["/login"]);
    }
    this.username = "";
    this.email = "";

  }

  ngOnInit(): void {
    this.refresh().then();
  }

  async refresh(){
    const info = await  this.userService.getInfo();
    this.username = info.username;
    this.email = info.email;
  }

  async updateEmail(newEmail : string){
    const changeSuccess = await this.userService.changeEmail(newEmail);
    if(changeSuccess){
      await this.refresh();
    }else{
      //TODO show error message
    }
  }

  async updateUsername(newUsername: string){
    const changeSuccess = await this.userService.changeUsername(newUsername);
    if(changeSuccess){
      await this.refresh();
    }else{
      //TODO show error message
    }
  }

  async updatePassword(oldPassword: string, newPassword: string){
    const changeSuccess = await this.userService.changePassword(oldPassword, newPassword);
    if(changeSuccess){
      await this.refresh();
    }else{
      //TODO show error message
    }
  }

  async deleteUser(password: string) {
    const deleteSuccess = await this.userService.deleteUser(password);
    if(deleteSuccess){

    }else{
      //TODO show error message
    }
  }
}

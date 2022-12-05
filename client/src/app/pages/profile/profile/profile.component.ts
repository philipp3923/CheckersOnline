import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {
    if(!this.userService.isUser()){
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit(): void {
  }

}

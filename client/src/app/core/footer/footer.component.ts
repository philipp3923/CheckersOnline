import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {MessageService, MessageType} from "../services/message.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public userService: UserService, private router: Router, private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  async logout() {
    await this.userService.logout();
    await this.userService.guest();
    await this.router.navigate([""]);
    this.messageService.addMessage(MessageType.INFO, "You are logged out.");
  }
}

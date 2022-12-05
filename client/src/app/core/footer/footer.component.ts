import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

}

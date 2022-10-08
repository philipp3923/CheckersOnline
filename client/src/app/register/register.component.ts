import { Component, OnInit } from '@angular/core';
import {ApiService} from "../_services/api.service";
import {DataService} from "../_services/data.service";
import {StorageService} from "../_services/storage.service";
import {SocketService} from "../_services/socket.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form = {
    email: null,
    username: null,
    password: null
  };

  constructor(private apiService: ApiService, private dataService: DataService, private storageService: StorageService, private socketService: SocketService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    if(this.form.email === null || this.form.password === null || this.form.username === null){
      console.log("ERROR: empty fields in form");
      //#TODO Display error message
      return;
    }

    if(this.storageService.getUser() !== null){
      //#TODO Display error message
      console.log("ERROR: already logged in");
      return;
    }

    this.apiService.register(this.form.username, this.form.email, this.form.password);
  }

}

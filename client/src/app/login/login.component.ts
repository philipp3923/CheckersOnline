import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../_services/api.service";
import {catchError, EMPTY} from "rxjs";
import {DataService} from "../_services/data.service";
import {StorageService} from "../_services/storage.service";
import {SocketService} from "../_services/socket.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form = {
    email: null,
    password: null
  };


  constructor(private apiService: ApiService, private dataService: DataService, private storageService: StorageService,private socketService: SocketService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {

    if(this.form.email === null || this.form.password === null){
      console.log("ERROR: empty fields in form");
      //#TODO Display error message
      return;
    }

    if(this.storageService.getUser() !== null){
      //#TODO Display error message
      console.log("ERROR: already logged in");
      return;
    }

    this.apiService.login(this.form.email, this.form.password);
  }

}

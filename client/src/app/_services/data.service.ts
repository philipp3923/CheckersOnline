import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userSource = new BehaviorSubject<User | null>(null);
  currentUser = this.userSource.asObservable();

  constructor() {
  }

  changeUser(user: User | null) {
    this.userSource.next(user);
    console.log(user);
  }
}

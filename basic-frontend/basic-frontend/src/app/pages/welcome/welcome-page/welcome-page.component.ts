import {Component, OnInit} from '@angular/core';
import {Echo} from "../../../models/echo.model";
import {ApiService} from "../../../core/services/api.service";
import {BehaviorSubject, debounceTime, skip} from "rxjs";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  createInput: string = '';
  filterInput: BehaviorSubject<string> = new BehaviorSubject<string>('');

  echos: BehaviorSubject<Echo[]> = new BehaviorSubject<Echo[]>([]);

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadEchos();
    this.filterInput.pipe(
      skip(1),
      debounceTime(400)
    ).subscribe(next => {
      this.loadEchos(next);
    });
  }

  addEcho(): void {
    this.apiService.createEcho({
      message: this.createInput
    }).subscribe((data: Echo) => {
      const newEchoList = [...this.echos.value, data];
      newEchoList.sort((a, b) => a.message.localeCompare(b.message));
      this.echos.next(newEchoList);
    });
  }

  loadEchos(filter?: string): void {
    this.apiService.getEchos(filter)
      .subscribe((data: Echo[]) => {
        data.sort((a, b) => a.message.localeCompare(b.message));
        this.echos.next(data);
      });
  }

  error(): void {
    this.apiService.doError().subscribe((data: Echo) => {
      console.log(data);
    }, (error: any) => {
      console.log('In Component:', error);
    });
  }
}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-container',
  templateUrl: './error-container.component.html',
  styleUrls: ['./error-container.component.css']
})
export class ErrorContainerComponent implements OnInit {

  errors: string[];

  constructor() {
    this.errors = [];
  }

  ngOnInit(): void {
  }

  add(msg: string){
    this.errors.push(msg);
  }

  remove(msg: string){
    const index = this.errors.indexOf(msg);
    if (index > -1) {
      this.errors.splice(index, 1);
    }
  }

}

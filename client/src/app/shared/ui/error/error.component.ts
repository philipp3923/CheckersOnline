import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

  @Input() message: string;
  @Output() removeEvent: EventEmitter<void>;

  constructor() {
    this.message = "";
    this.removeEvent = new EventEmitter();
  }

}

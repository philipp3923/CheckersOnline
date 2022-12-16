import {Component, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({transform: "translate(-50%,-150%)", opacity: 0}),
            animate('0.6s ease-out',
              style({transform: "translate(-50%, 0)", opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({transform: "translate(-50%, 0)", opacity: 1}),
            animate('0.6s ease-in',
              style({transform: "translate(-50%,-150%)", opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class MessageComponent implements OnInit {

  constructor(public messageService: MessageService) {
  }

  ngOnInit(): void {
  }

}

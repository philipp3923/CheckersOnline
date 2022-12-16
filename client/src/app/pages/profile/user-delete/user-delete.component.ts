import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MessageService,
  MessageType,
} from '../../../core/services/message.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css'],
})
export class UserDeleteComponent implements OnInit {
  edit: boolean;
  @ViewChild('input') input: ElementRef<HTMLInputElement> | undefined;
  @Output() updateEvent: EventEmitter<string>;

  constructor(private messageService: MessageService) {
    this.edit = false;
    this.updateEvent = new EventEmitter<string>();
  }

  ngOnInit(): void {}

  switchEdit() {
    this.edit = !this.edit;
  }

  update() {
    if (this.input?.nativeElement.value === '' || !this.input) {
      this.messageService.addMessage(
        MessageType.WARNING,
        'Fill out all fields.'
      );
      return;
    }
    this.updateEvent.emit(this.input.nativeElement.value);
    this.input.nativeElement.value = '';
    this.edit = false;
  }
}

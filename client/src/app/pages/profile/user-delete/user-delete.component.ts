import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {
  edit: boolean;
  @ViewChild("input") input: ElementRef<HTMLInputElement> | undefined;
  @Output() updateEvent: EventEmitter<string>;

  constructor() {
    this.edit = false;
    this.updateEvent = new EventEmitter<string>();
  }

  ngOnInit(): void {
  }

  switchEdit() {
    this.edit = !this.edit;
  }

  update() {
    if(this.input?.nativeElement.value === "" || !this.input){
      return;
    }
    this.updateEvent.emit(this.input.nativeElement.value);
    this.input.nativeElement.value = "";
    this.edit = false;
  }
}

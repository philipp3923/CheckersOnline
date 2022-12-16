import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MessageService, MessageType} from "../../../core/services/message.service";

@Component({
  selector: 'app-user-property',
  templateUrl: './user-property.component.html',
  styleUrls: ['./user-property.component.css']
})
export class UserPropertyComponent implements OnInit {

  @Input() name: string;
  @Input() value: string;
  @Input() repetitionOnUpdate: boolean;
  @Input() needsOldValue: boolean;
  @ViewChild("input") input: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("input_repeat") inputRepeat: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("input_old") inputOld: ElementRef<HTMLInputElement> | undefined;
  @Output() updateEvent: EventEmitter<{ new: string, old: string }>;
  public edit: boolean;
  inputsMatch: boolean;

  constructor(private messageService: MessageService) {
    this.name = "NO NAME";
    this.value = "NO VALUE";
    this.edit = false;
    this.needsOldValue = false;
    this.repetitionOnUpdate = false;
    this.updateEvent = new EventEmitter<{ new: string, old: string }>();
    this.inputsMatch = true;
  }

  public switchEdit() {
    this.edit = !this.edit;
    this.compareInputs();
  }

  public update() {
    if (this.input?.nativeElement.value === "") {
      this.messageService.addMessage(MessageType.WARNING, "Fill out all fields.");
      return;
    }
    if (this.compareInputs() || !this.repetitionOnUpdate) {
      this.updateEvent.emit({
        new: this.input?.nativeElement.value ?? "",
        old: this.inputOld?.nativeElement.value ?? ""
      });
      if (this.input) {
        this.input.nativeElement.value = "";
      }
      if (this.inputOld) {
        this.inputOld.nativeElement.value = "";
      }
      if (this.inputRepeat) {
        this.inputRepeat.nativeElement.value = "";
      }
      this.edit = false;
    }
  }

  public compareInputs() {
    this.inputsMatch = ((this.input?.nativeElement.value === this.inputRepeat?.nativeElement.value)) || !this.repetitionOnUpdate;
    return this.inputsMatch;
  }


  ngOnInit(): void {
  }

}

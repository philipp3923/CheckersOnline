import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-user-property',
  templateUrl: './user-property.component.html',
  styleUrls: ['./user-property.component.css']
})
export class UserPropertyComponent implements OnInit {

  @Input() name: string;
  @Input() value: string;
  @Input() repetitionOnUpdate: boolean;
  @ViewChild("input") input: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("input_repeat") inputRepeat: ElementRef<HTMLInputElement> |undefined;
  @Output() updateEvent: EventEmitter<string>;
  public edit: boolean;
  inputsMatch: boolean;

  constructor() {
    this.name = "NO NAME";
    this.value = "NO VALUE";
    this.edit = false;
    this.repetitionOnUpdate = false;
    this.updateEvent = new EventEmitter<string>();
    this.inputsMatch = true;
  }

  public switchEdit(){
    this.edit = !this.edit;
  }

  public update(){
    if(this.compareInputs() || !this.repetitionOnUpdate){
      this.updateEvent.emit(this.input?.nativeElement.value ?? "");
    }
  }

  public compareInputs(){
    this.inputsMatch = ((this.input?.nativeElement.value === this.inputRepeat?.nativeElement.value) && typeof this.input !== "undefined");
    return this.inputsMatch;
  }


  ngOnInit(): void {
  }

}

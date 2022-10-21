import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './ui/error/error.component';
import { ErrorContainerComponent } from './features/error-container/error-container.component';



@NgModule({
  declarations: [
    ErrorComponent,
    ErrorContainerComponent
  ],
  exports: [
    ErrorContainerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

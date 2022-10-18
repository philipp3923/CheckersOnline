import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements AfterViewInit {

  @ViewChild("canvas")
  canvas: ElementRef<HTMLCanvasElement>

  constructor() { }

  ngAfterViewInit(): void {
  }

}

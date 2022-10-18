import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements AfterViewInit {
  //#TODO move constants to external file
  private tiles = 8;
  private animationDelay = 10;
  private animationLength = 20;
  private whiteTileColor = "rgb(100, 100, 100)";
  private blackTileColor = "rgb(250, 250, 250)";
  private highlightColor = "rgba(0,0,150,0.25)";
  private tileSize = 0;

  @ViewChild("canvas")
  private canvas: ElementRef<HTMLCanvasElement> | null  = null;
  private context: CanvasRenderingContext2D | null  =null;
  private boundingRect: DOMRect | null = null;
  private board: HTMLCanvasElement | null = null;

  constructor() { }

  ngAfterViewInit(): void {
    if(this.canvas === null){
      throw new Error("Board attributes not initialized");
    }
    this.context = <CanvasRenderingContext2D>this.canvas.nativeElement.getContext('2d');
    this.board = this.canvas.nativeElement;
    this.boundingRect = this.canvas.nativeElement.getBoundingClientRect();

    this.tileSize = Math.min(this.board.width, this.board.height) / this.tiles;

  }

  onMouseDown(event: MouseEvent){
    console.log(event);
  }

}

import {AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import PositionModel from "../../../models/position.model";
import {Observable, Subject} from "rxjs";

//TODO move constants
const TILES = 8;
const ANIMATION_DELAY = 10;
const ANIMATION_LENGTH = 10;
const WHITE_TILE_COLOR = "rgb(100, 100, 100)";
const BLACK_TILE_COLOR = "rgb(250, 250, 250)";
const HIGHLIGHT_COLOR = "rgba(0,0,150,0.25)";
const BOARD_SIZE = 1000;
const TILE_SIZE = BOARD_SIZE / TILES;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  @ViewChild('boardcanvas')
  public canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild("box")
  public box: ElementRef<HTMLDivElement> | undefined;

  public context: CanvasRenderingContext2D | undefined;
  public boundingRect: DOMRect | undefined;
  @ViewChild('bd')
  public bd_img: ElementRef<HTMLImageElement> | undefined;
  @ViewChild('bp')
  public bp_img: ElementRef<HTMLImageElement> | undefined;
  @ViewChild('wd')
  public wd_img: ElementRef<HTMLImageElement> | undefined;
  @ViewChild('wp')
  public wp_img: ElementRef<HTMLImageElement> | undefined;
  @Input()
  public turnBoard: boolean;
  private state: number[][];
  private animation: boolean;
  private clickStream = new Subject<PositionModel>();
  @Output()
  public clickObserver: Observable<PositionModel> = this.clickStream.asObservable();
  private stateWasSet = false;

  constructor() {
    this.state = [
      [0, -1, 0, -1, 0, -1, 0, -1],
      [-1, 0, -1, 0, -1, 0, -1, 0],
      [0, -1, 0, -1, 0, -1, 0, -1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0]
    ];
    this.turnBoard = false;
    this.animation = false;
    window.addEventListener("resize", () => this.fitBoard());

  }

  public reset() {
    this.state = [
      [0, -1, 0, -1, 0, -1, 0, -1],
      [-1, 0, -1, 0, -1, 0, -1, 0],
      [0, -1, 0, -1, 0, -1, 0, -1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0]
    ];
    this.stateWasSet = true;
  }

  public setState(state: number[][]) {
    this.state = state;
    this.stateWasSet = true;
  }

  ngAfterViewInit(): void {
    this.fitBoard();
    this.canvas = <ElementRef<HTMLCanvasElement>>this.canvas;
    this.context = this.canvas.nativeElement.getContext('2d')!;
    this.boundingRect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = BOARD_SIZE;
    this.canvas.nativeElement.height = BOARD_SIZE;
    //@ts-ignore
    this.wp_img.nativeElement.addEventListener("load", () => this.refresh());
    //@ts-ignore
    this.bp_img.nativeElement.addEventListener("load", () => this.refresh());
    //@ts-ignore
    this.wd_img.nativeElement.addEventListener("load", () => this.refresh());
    //@ts-ignore
    this.bd_img.nativeElement.addEventListener("load", () => this.refresh());

  }

  ngOnInit(): void {
  }

  public move(from: PositionModel, to: PositionModel, capture: boolean) {
    this.flushScreen();
    this.drawBackground();
    this.drawPieces({from: from, to: to, capture: capture});
  }

  public select(position: PositionModel, possibilities: PositionModel[]) {
    this.flushScreen();
    this.drawBackground();
    this.drawHighlight(position);
    this.drawPossibilities(possibilities);
    this.drawPieces();
  }

  public getState() {
    return this.state;
  }

  public refresh() {
    this.flushScreen();
    this.drawBackground();
    if (this.stateWasSet) {
      this.drawPieces();
    }
  }

  onMousedown($event: MouseEvent) {
    this.boundingRect = <DOMRect>this.canvas?.nativeElement.getBoundingClientRect();
    if (this.animation) {
      return;
    }
    const tile_size_onscreen = Math.abs((this.boundingRect.bottom - this.boundingRect.top) / TILES);
    const row = Math.floor(($event.clientY - this.boundingRect.top) / tile_size_onscreen);
    const column = Math.floor(($event.clientX - this.boundingRect.left) / tile_size_onscreen);
    this.clickStream.next({x: this.transformX(column), y: this.transformY(row)});
  }

  public transformX(x: number) {
    return this.turnBoard ? 7 - x : x;
  }

  public transformY(y: number) {
    return this.turnBoard ? 7 - y : y;
  }

  private fitBoard() {
    if (typeof this.box === "undefined" || typeof this.canvas === "undefined") {
      return;
    }
    /*let w = this.box.nativeElement.clientWidth-10;
    let h = this.box.nativeElement.clientHeight-10;
    if(document.body.clientHeight < 700 && document.body.clientWidth > 400){
      this.canvas.nativeElement.style.maxWidth = "300px";
    }else if(document.body.clientHeight < 900 && document.body.clientWidth > 520){
      this.canvas.nativeElement.style.maxWidth = "400px";
    }else{
      this.canvas.nativeElement.style.maxWidth = "600px";
    }*/
    //console.log(document.body.clientHeight);

  }

  private flushScreen() {
    this.context?.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
  }

  private drawBackground() {
    this.context = <CanvasRenderingContext2D>this.context;

    for (let r = 0; r < TILES; r++) {
      for (let c = 0; c < TILES; c++) {
        if ((r + c) % 2 == 1) {
          this.context.fillStyle = WHITE_TILE_COLOR;
        } else {
          this.context.fillStyle = BLACK_TILE_COLOR;
        }
        this.context.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  private drawHighlight(position: PositionModel) {
    this.context = <CanvasRenderingContext2D>this.context;

    this.context.strokeStyle = "rgb(0,0,150)";
    this.context.shadowColor = "gray";
    this.context.shadowBlur = TILE_SIZE / 10;
    this.context.lineJoin = "round";
    this.context.lineWidth = TILE_SIZE / 20;
    this.context.strokeRect((this.transformX(position.x) * TILE_SIZE), (this.transformY(position.y) * TILE_SIZE), TILE_SIZE, TILE_SIZE);
    this.context.shadowBlur = 0;
    this.context.shadowColor = "rgba(0,0,0,0)";

  }

  private drawPossibilities(position: PositionModel[]) {
    this.context = <CanvasRenderingContext2D>this.context;

    this.context.fillStyle = "rgba(0,0,150,0.6)";
    for (let i = 0; i < position.length; i++) {
      this.context.fillRect(this.transformX(position[i].x) * TILE_SIZE, this.transformY(position[i].y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  private drawPieces(move: { from: PositionModel, to: PositionModel, capture: boolean } | null = null, frame: number = 0) {
    this.context = <CanvasRenderingContext2D>this.context;
    const animationOffset = [0.0, 0.0];
    if (move) {
      this.animation = true;
      let y_movement = move.to.y - move.from.y;
      let x_movement = move.to.x - move.from.x;

      if (this.turnBoard) {
        y_movement *= -1;
        x_movement *= -1;
      }

      animationOffset[1] = (TILE_SIZE * x_movement * frame) / ANIMATION_LENGTH;
      animationOffset[0] = (TILE_SIZE * y_movement * frame) / ANIMATION_LENGTH;
      if (move.capture && frame >= ANIMATION_LENGTH / 2.0) {
        this.state[move.to.y - ((move.to.y - move.from.y) / 2.0)][move.to.x - ((move.to.x - move.from.x) / 2.0)] = 0;
      }
    }
    //draw pieces
    for (let r = 0; r < TILES; r++) {
      for (let c = 0; c < TILES; c++) {
        const rt = this.transformX(r);
        const ct = this.transformY(c);
        if (move != null && r == move.from.y && c == move.from.x) {
          if (this.state[r][c] == 1) {
            this.context.drawImage(<HTMLImageElement>this.wp_img?.nativeElement, (ct * TILE_SIZE) + animationOffset[1], (rt * TILE_SIZE) + animationOffset[0], TILE_SIZE, TILE_SIZE);
          } else if (this.state[r][c] == -1) {
            this.context.drawImage(<HTMLImageElement>this.bp_img?.nativeElement, (ct * TILE_SIZE) + animationOffset[1], (rt * TILE_SIZE) + animationOffset[0], TILE_SIZE, TILE_SIZE);
          } else if (this.state[r][c] == 2) {
            this.context.drawImage(<HTMLImageElement>this.wd_img?.nativeElement, (ct * TILE_SIZE) + animationOffset[1], (rt * TILE_SIZE) + animationOffset[0], TILE_SIZE, TILE_SIZE);
          } else if (this.state[r][c] == -2) {
            this.context.drawImage(<HTMLImageElement>this.bd_img?.nativeElement, (ct * TILE_SIZE) + animationOffset[1], (rt * TILE_SIZE) + animationOffset[0], TILE_SIZE, TILE_SIZE);
          }
        } else {
          if (this.state[r][c] == 1) {
            this.context.drawImage(<HTMLImageElement>this.wp_img?.nativeElement, (ct * TILE_SIZE), (rt * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          } else if (this.state[r][c] == -1) {
            this.context.drawImage(<HTMLImageElement>this.bp_img?.nativeElement, (ct * TILE_SIZE), (rt * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          } else if (this.state[r][c] == 2) {
            this.context.drawImage(<HTMLImageElement>this.wd_img?.nativeElement, (ct * TILE_SIZE), (rt * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          } else if (this.state[r][c] == -2) {
            this.context.drawImage(<HTMLImageElement>this.bd_img?.nativeElement, (ct * TILE_SIZE), (rt * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          }
        }

      }
    }

    if (move) {
      if (frame < ANIMATION_LENGTH) {
        frame++;
        //console.log(frame);
        setTimeout(() => {
          this.flushScreen();
          this.drawBackground();
          this.drawPieces(move, frame);
        }, ANIMATION_DELAY);
      } else if (this.animation) {
        //updateBoardAfterMove
        this.state[move.to.y][move.to.x] = this.state[move.from.y][move.from.x];
        this.state[move.from.y][move.from.x] = 0;

        // dame conversions
        if (this.state[move.to.y][move.to.x] > 0 && move.to.y == 0 || this.state[move.to.y][move.to.x] < 0 && move.to.y == 7) {
          this.state[move.to.y][move.to.x] *= 2;
        }
        //console.log("AFTER ANIMATION");
        //console.table(this.state);
        this.animation = false;
        this.flushScreen();
        this.drawBackground();
        this.drawPieces();
      }

    }
  }
}

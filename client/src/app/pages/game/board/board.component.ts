import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

//TODO move constants
const TILES = 8;
const ANIMATION_DELAY = 10;
const ANIMATION_LENGTH = 20;
const WHITE_TILE_COLOR = "rgb(100, 100, 100)";
const BLACK_TILE_COLOR = "rgb(250, 250, 250)";
const HIGHLIGHT_COLOR = "rgba(0,0,150,0.25)";
const BOARD_SIZE = 600;
const TILE_SIZE = BOARD_SIZE / TILES;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @ViewChild('boardcanvas')
  public canvas: ElementRef<HTMLCanvasElement> | undefined;

  public context: CanvasRenderingContext2D | undefined;
  public boundingRect: DOMRect | undefined;

  public state: number[][];

  @ViewChild('bd')
  public bd_img: ElementRef<HTMLImageElement>| undefined;
  @ViewChild('bp')
  public bp_img: ElementRef<HTMLImageElement>| undefined;
  @ViewChild('wd')
  public wd_img: ElementRef<HTMLImageElement>| undefined;
  @ViewChild('wp')
  public wp_img: ElementRef<HTMLImageElement>| undefined;

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
  }

  ngAfterViewInit(): void {
    this.canvas = <ElementRef<HTMLCanvasElement>>this.canvas;
    this.context = this.canvas.nativeElement.getContext('2d')!;
    this.boundingRect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = BOARD_SIZE;
    this.canvas.nativeElement.height = BOARD_SIZE;
    //@ts-ignore
    this.wp_img.nativeElement.onload = () => this.draw();
  }

  ngOnInit(): void {
  }

  public draw(move: number[] | null = null, frame: number = ANIMATION_LENGTH) {
    this.context = <CanvasRenderingContext2D>this.context;
    this.canvas = <ElementRef<HTMLCanvasElement>>this.canvas;
    this.context.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);


    const animationOffset = [0.0, 0.0];
    if (move) {
      const y_movement = move[2] - move[0];
      animationOffset[0] = (TILE_SIZE * y_movement * frame) / ANIMATION_LENGTH;
      const x_movement = move[3] - move[1];
      animationOffset[1] = (TILE_SIZE * x_movement * frame) / ANIMATION_LENGTH;

      if (move[4] == 1 && frame >= ANIMATION_LENGTH / 2) {
        this.state[move[2] - ((move[2] - move[0]) / 2)][move[3] - ((move[3] - move[1]) / 2)] = 0;
      }
    }

    // draw background tiles
    for (let r = 0; r < TILES; r++) {
      for (let c = 0; c < TILES; c++) {
        if ((r + c) % 2 == 1) {
          this.context.fillStyle = WHITE_TILE_COLOR;
        }
        else {
          this.context.fillStyle = BLACK_TILE_COLOR;
        }
        this.context.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // draw possible moves
    /*if (selectedTile[0] >= 0 && selectedTile[0] <= 7 && selectedTile[1] >= 0 && selectedTile[1] <= 7) {
      context.fillStyle = highlightColor;
      for (let i = 0; i < allPossibleMoves.length; i++) {
        possibleMove = allPossibleMoves[i];
        fromy = possibleMove[0];
        fromx = possibleMove[1];
        if (selectedTile[0] == fromy && selectedTile[1] == fromx) {
          toy = possibleMove[2];
          tox = possibleMove[3];
          context.fillRect(tox * tileSize, toy * tileSize, tileSize, tileSize);
        }
        possibleMove = null;
      }
    }
    possibleMove = fromy = fromx = toy = toy = null;*/
    console.log(this.wp_img?.nativeElement)
    //draw pieces
    for (let r = 0; r < TILES; r++) {
      for (let c = 0; c < TILES; c++) {
        if (move != null && r == move[0] && c == move[1]) {
          if (this.state[r][c] == 1) {
            this.context.drawImage(<HTMLImageElement>this.wp_img?.nativeElement, (c * TILE_SIZE)+animationOffset[1], (r * TILE_SIZE)+animationOffset[0], TILE_SIZE, TILE_SIZE);
          }
          else if (this.state[r][c] == -1) {
            this.context.drawImage(<HTMLImageElement>this.bp_img?.nativeElement, (c * TILE_SIZE)+animationOffset[1], (r * TILE_SIZE)+animationOffset[0], TILE_SIZE, TILE_SIZE);
          }
          else if (this.state[r][c] == 2) {
            this.context.drawImage(<HTMLImageElement>this.wd_img?.nativeElement, (c * TILE_SIZE)+animationOffset[1], (r * TILE_SIZE)+animationOffset[0], TILE_SIZE, TILE_SIZE);
          }
          else if (this.state[r][c] == -2) {
            this.context.drawImage(<HTMLImageElement>this.bd_img?.nativeElement, (c * TILE_SIZE)+animationOffset[1], (r * TILE_SIZE)+animationOffset[0], TILE_SIZE, TILE_SIZE);
          }
        }
        else {
          if (this.state[r][c] == 1) {
            this.context.drawImage(<HTMLImageElement>this.wp_img?.nativeElement, (c * TILE_SIZE), (r * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          }
          else if (this.state[r][c] == -1) {
            this.context.drawImage(<HTMLImageElement>this.bp_img?.nativeElement, (c * TILE_SIZE), (r * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          }
          else if (this.state[r][c] == 2) {
            this.context.drawImage(<HTMLImageElement>this.wd_img?.nativeElement, (c * TILE_SIZE), (r * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          }
          else if (this.state[r][c] == -2) {
            this.context.drawImage(<HTMLImageElement>this.bd_img?.nativeElement, (c * TILE_SIZE), (r * TILE_SIZE), TILE_SIZE, TILE_SIZE);
          }
        }

      }
    }
  }

}

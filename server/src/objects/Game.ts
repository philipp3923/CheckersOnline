import Board, {Color, Play} from "./Board";

export enum GameType{
    FRIEND, CASUAL, RANKED, CUSTOM, COMPUTER
}

export default abstract class Game{
    protected timestamp: number;
    protected readonly plays: Play[];
    protected board: Board;
    protected finished: boolean;

    constructor(private id: string, private key: string, private type: GameType) {
        this.plays = [];
        this.board = new Board();
        this.finished = false;
        this.timestamp = Date.now();
    }

    protected abstract start(): void;

    protected abstract finish(): void;

    public abstract play(index: number): Promise<boolean>;

    public abstract getWinner(): Color | null;

    public getType(){
        return this.type;
    }

    public getID(){
        return this.id;
    }

    public getKey(){
        return this.key;
    }

    public abstract getNext(): string | null;

    public getGameState(){
        return {key: this.getKey(), id: this.getID(), board: this.board.getState(), possibleTurns: this.board.getPossibleTurns(), nextColor: this.board.getNextTurn(), winner: this.board.getWinner(), plays: this.plays, timestamp: this.timestamp};
    }

    protected switchColor(color: Color): Color{
        return color === Color.BLACK ? Color.WHITE : Color.BLACK;
    }

}

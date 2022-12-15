import BoardModel, {Color, Play} from "./Board.model";

export enum GameType{
    FRIEND, CASUAL, RANKED, CUSTOM, COMPUTER
}

export default abstract class GameModel {
    protected timestamp: number;
    protected readonly plays: Play[];
    protected board: BoardModel;
    protected finished: boolean;

    constructor(private id: string, private key: string, private type: GameType) {
        this.plays = [];
        this.board = new BoardModel();
        this.finished = false;
        this.timestamp = Date.now();
    }

    public getPlays(){
        return this.plays;
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

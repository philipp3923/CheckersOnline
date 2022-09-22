import Board from "./Board";

export default class Game {
    readonly id: string;
    readonly time: number | null;
    board: Board;
    turns: Checkers.Turn[];
    next_turn: 1 | 2 | null;
    players: [Checkers.Player | null, Checkers.Player | null];

    constructor(id: string, time: number) {
        this.id = id;
        this.time = time;
        this.board = new Board();
        this.turns = [];
        this.next_turn = 1;
        this.players = [null, null];
    }


}
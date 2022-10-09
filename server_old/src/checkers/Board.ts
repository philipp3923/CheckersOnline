type field = -2 | -1 | 0 | 1 | 2;

export default class Board{
    state: field[][];

    constructor() {
        this.state = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ];
    }

    //#TODO implement method possibleTurns
    getTurns(player: 1 | 2): Checkers.Turn[] {
        return [];
    }

    //#TODO implement method doTurn
    doTurn(turn: Checkers.Turn){

    }
}

export enum Values {
    E = 0, BS = 1, WS = -1, BD = 2, WD = -2
}

export interface Play {
    color: Color
    capture: boolean
    start: Location
    target: Location
    time?: number
}

export interface Location {
    x: number
    y: number
}

export enum Color{
    WHITE= -1, BLACK=1
}

export default class Board {
    private state: Values[][];
    private lastTurn: Play | null;
    private possibleTurns: Play[];
    private nextTurn: Color | null;
    private winner: Color | null;

    constructor() {
        this.state = [
            [0, -1, 0, -1, 0, -1, 0, -1],
            [-1, 0, -1, 0, -1, 0, -1, 0],
            [0, -1, 0, -1, 0, -1, 0, -1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
        this.lastTurn = null;
        this.winner = null;
        this.nextTurn = Color.WHITE;
        this.possibleTurns = [];
        this.calculatePossibleTurns();
    }

    public getPossibleTurns(): Play[] {
        return this.possibleTurns;
    }

    /**
     * #TODO implement tie rules
     */
    public getWinner(): Color | null{
        return this.winner;
    }

    public setWinner(color: Color){
        this.winner = color;
    }

    public setNextTurnNull(){
        this.nextTurn = null;
    }

    public play(turn: number) {
        if (typeof this.possibleTurns[turn] === "undefined") {
            throw new Error("Illegal turn attempt");
        }
        this.turn(this.possibleTurns[turn].start, this.possibleTurns[turn].target);
        this.lastTurn = this.possibleTurns[turn];

        if (this.lastTurn.capture) {
            this.possibleTurns = this.calculatePossibleCaptures(this.lastTurn.target);
        } else {
            this.possibleTurns = [];
        }

        if (this.possibleTurns.length <= 0) {
            this.nextTurn = this.lastTurn.color === Color.BLACK ? Color.WHITE : Color.BLACK;
            this.calculatePossibleTurns();
        }

        if (this.possibleTurns.length <= 0) {
            this.nextTurn = null;
            this.winner = this.lastTurn?.color ?? null;
        }
    }

    private turn(start: Location, target: Location) {
        if (Math.abs(start.x - target.x) === 2) {
            this.setValue(
                {
                    x: start.x + Math.floor((target.x - start.x) / 2),
                    y: start.y + Math.floor((target.y - start.y) / 2),
                },
                0
            );
        }
        if ((target.y === 0 || target.y === 7) && Math.abs(this.getValue(start)) === 1) {
            this.setValue(target, this.getValue(start) * 2);
        } else {
            this.setValue(target, this.getValue(start));
        }
        this.setValue(start, 0);
    }

    private calculatePossibleTurns() {
        this.possibleTurns = [];
        let capture = false;

        if (this.lastTurn?.color === this.nextTurn && this.lastTurn.capture) {
            this.possibleTurns.push(...this.calculatePossibleCaptures(this.lastTurn.target));
            return;
        }

        for (let y = 0; y < this.state.length; y++) {
            for (let x = 0; x < this.state[0].length; x++) {
                if (this.getValue({x: x, y: y}) * (this.nextTurn ?? 0) <= 0) {
                    continue;
                }

                const possibleCaptures = this.calculatePossibleCaptures({x: x, y: y});

                if (!capture && possibleCaptures.length <= 0) {
                    this.possibleTurns.push(...this.calculatePossibleMoves({x: x, y: y}));
                }
                else if (capture) {
                    this.possibleTurns.push(...possibleCaptures);
                }
                else {
                    capture = true;
                    this.possibleTurns = [];
                    this.possibleTurns.push(...possibleCaptures);
                }
            }
        }

    }

    private calculatePossibleCaptures(location: Location): Play[] {
        const captures: Play[] = [];

        const targets: Location[] = [
            {x: location.x - 2, y: location.y + 2},
            {x: location.x + 2, y: location.y + 2},
            {x: location.x + 2, y: location.y - 2},
            {x: location.x - 2, y: location.y - 2},
        ];

        for (const target of targets) {
            if (
                this.isField(target) &&
                this.isCapture(location, target)
            ) {
                captures.push({
                    color: this.getValue(location) < 0 ? Color.WHITE : Color.BLACK,
                    start: location,
                    target: target,
                    capture: true
                });
            }
        }

        return captures;
    }

    private calculatePossibleMoves(location: Location): Play[] {
        const moves: Play[] = [];

        const targets: Location[] = [
            {x: location.x - 1, y: location.y + 1},
            {x: location.x + 1, y: location.y + 1},
            {x: location.x + 1, y: location.y - 1},
            {x: location.x - 1, y: location.y - 1},
        ];

        for (const target of targets) {
            if (
                this.isField(target) &&
                this.isMove(location, target)
            ) {
                moves.push({
                    color: this.getValue(location) < 0 ? Color.WHITE : Color.BLACK,
                    start: location,
                    target: target,
                    capture: false
                });
            }
        }

        return moves;
    }

    private isField(location: Location) {
        return location.y < this.state.length && location.y >= 0 && location.x >= 0 && location.x < this.state[0].length;
    }

    private isMove(location: Location, target: Location) {
        const locationValue = this.getValue(location);
        const targetValue = this.getValue(target);

        if (locationValue !== 0 && targetValue === 0) {
            if (locationValue < 0 || Math.abs(locationValue) > 1) {
                if (target.y - location.y === 1 && Math.abs(target.x - location.x) === 1) {
                    return true;
                }
            }
            if (locationValue > 0 || Math.abs(locationValue) > 1) {
                if (target.y - location.y === -1 && Math.abs(target.x - location.x) === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    private isCapture(location: Location, target: Location) {
        const locationValue = this.getValue(location);
        const targetValue = this.getValue(target);
        if (locationValue !== 0 && targetValue === 0) {
            if (locationValue < 0 || Math.abs(locationValue) > 1) {
                if (target.y - location.y === 2 && Math.abs(target.x - location.x) === 2) {
                    if (
                        this.getValue({
                            x: location.x + Math.floor((target.x - location.x) / 2),
                            y: location.y + Math.floor((target.y - location.y) / 2),
                        }) * this.getValue(location) < 0
                    ) {
                        return true;
                    }
                }
            }
            if (locationValue > 0 || Math.abs(locationValue) > 1) {
                if (target.y - location.y === -2 && Math.abs(target.x - location.x) === 2) {
                    if (
                        this.getValue({
                            x: location.x + Math.floor((target.x - location.x) / 2),
                            y: location.y + Math.floor((target.y - location.y) / 2),
                        }) * this.getValue(location) < 0
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private getValue(location: Location): number {
        return this.state[location.y][location.x];
    }

    private setValue(location: Location, value: Values) {
        this.state[location.y][location.x] = value;
    }

    public getState(){
        return this.state;
    }

    public getNextTurn(): Color | null{
        return this.nextTurn;
    }

}
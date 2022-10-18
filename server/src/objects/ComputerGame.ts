import {Color} from "./Board";
import Game, {GameType} from "./Game";

export default class ComputerGame extends Game{
    private readonly player: Color;

    constructor(id: string, key: string, difficulty: number) {
        super(id, key, GameType.COMPUTER);
        this.player = Math.random() >= 0.5 ? Color.WHITE : Color.BLACK;
    }

    public finish(): void {
    }

    public getWinner(): Color | null {
        return null;
    }

    public play(index: number): Promise<boolean> {
        return Promise.resolve(false);
    }

    protected start(): void {
    }

    public getGameState() {
        const state: any =  super.getGameState();
        state.player = this.player;
        return state;
    }

    /**
     * @deprecated Method not implemented
     */
    public getNext(): string | null {
        throw new Error("Method not implemented.");
    }

}

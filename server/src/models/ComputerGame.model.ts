import { Color } from "./Board.model";
import GameModel, { GameType } from "./Game.model";

export default class ComputerGameModel extends GameModel {
  private readonly player: Color;

  /**
   *
   * @param id
   * @param key
   * @param difficulty
   * @deprecated Not implemented!
   */
  constructor(id: string, key: string, difficulty: number) {
    super(id, key, GameType.COMPUTER);
    this.player = Math.random() >= 0.5 ? Color.WHITE : Color.BLACK;
  }

  public finish(): void {}

  public getWinner(): Color | null {
    return null;
  }

  public play(index: number): Promise<boolean> {
    return Promise.resolve(false);
  }

  protected start(): void {}

  public getGameState() {
    const state: any = super.getGameState();
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

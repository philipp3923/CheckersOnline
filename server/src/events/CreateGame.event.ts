import AbstractEvent from "./Abstract.event";
import SocketService, { SocketResponse } from "../services/Socket.service";
import GameService, { TimeType } from "../services/Game.service";
import Connection from "../models/Connection.model";
import Game, { GameType } from "../models/Game.model";
import FriendshipService from "../services/Friendship.service";
import UserGame from "../models/UserGame.model";

export interface TimeDict {
  [id: string]: { time: number; increment: number };
}

export interface TimeObject {
  time: number;
  increment: number;
}

export default class CreateGameEvent extends AbstractEvent {
  public constructor(
    socketService: SocketService,
    private gameService: GameService,
    private friendshipService: FriendshipService
  ) {
    super(socketService, "createGame");
  }

  public async on(connection: Connection, args: any, respond: SocketResponse) {
    if (connection.getGameCount() > 20) {
      respond({
        success: false,
        error: "Exceeded amount of possible simultaneous games",
      });
      return;
    }

    const timeType = this.getTimeTypeKeyByValue(args.timeType);
    const gameType = this.getGameTypeKeyByValue(args.gameType);

    if (
      typeof gameType === "undefined" ||
      typeof timeType === "undefined" ||
      (typeof args.invitation !== "string" && gameType === GameType.FRIEND)
    ) {
      respond({ success: false, error: "Required arguments not provided" });
      return;
    }

    if (
      gameType === GameType.RANKED ||
      gameType === GameType.CASUAL ||
      gameType === GameType.COMPUTER
    ) {
      respond({ success: false, error: "Not implemented" });
      return;
    }

    if (
      gameType === GameType.FRIEND &&
      !(await this.friendshipService.exists(
        connection.getID(),
        args.invitation
      ))
    ) {
      respond({ success: false, error: "Friendship does not exist" });
      return;
    }

    if (gameType === GameType.FRIEND &&!this.socketService.isOnline(args.invitation)) {
      respond({ success: false, error: "Friend is not online" });
      return;
    }

    let game: Game | null = null;

    try {
      game = await this.gameService.createGame(
        gameType,
        timeType,
        args.time,
        args.increment
      );
    } catch (e) {
      respond({
        success: false,
        error: "This specific game cannot be created",
      });
      return;
    }

    try {
      await connection.joinGame(game);
    } catch (e) {
      respond({ success: false, error: "Game is full" });
      return;
    }

    if (gameType === GameType.FRIEND) {
      this.gameService.invitePlayer(<UserGame>game, args.invitation);
    }

    respond({ success: true, key: game.getKey() });
  }

  private getGameTypeKeyByValue(
    key: keyof typeof GameType
  ): GameType | undefined {
    return GameType[key];
  }

  private getTimeTypeKeyByValue(
    key: keyof typeof TimeType
  ): TimeType | undefined {
    return TimeType[key];
  }
}

import {Server} from "socket.io";
import GameHandler from "../checkers/GameHandler";
import Game from "../checkers/Game";

export default function socketConnection(io: Server, socket: AuthSocket, gameHandler: GameHandler) {

    if (!socket.user) {
        return;
    }

    console.log(socket.user.username + " CONNECTED")

    let current_game: Game | null = gameHandler.getGameByUser(socket.user);

    socket.on("disconnect", on_disconnect);
    socket.on("createGame", on_createGame);

    function on_createGame(time: unknown) {
        if (current_game !== null) {
            io.to(socket.id).emit("createGame", error(1, "You are in game."));
            return;
        }

        if (!Number.isInteger(time) || <number>time < 0) {
            io.to(socket.id).emit("createGame", error(2, "Time is not a number."));
            return;
        }

        const safe_time: number = Math.round(<number>time);

        if (safe_time < 0) {
            io.to(socket.id).emit("createGame", error(3, "Time is a negative number."));
            return;
        }

        if (safe_time != 0 && safe_time < 30 || safe_time > 3000000) {
            io.to(socket.id).emit("createGame", error(2, "Time is not 0 or between 30 and 3.000.000"));
            return;
        }

        current_game = new Game(gameHandler.generateGameID(), safe_time);

        current_game.addPlayer(<User>socket.user);

        gameHandler.addGame(current_game, false);

        io.to(socket.id).emit("createGame", response({game: current_game}));

    }

    function on_disconnect() {

    }

    function error(code: number, msg: string) {
        return response({
            code: code,
            type: "error",
            msg: msg
        });
    }

    function response(args: Object) {
        return {timestamp: Date.now(), ...args};
    }

}

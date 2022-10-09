import {Socket} from "socket.io";
import Game from "../checkers/Game";

export {};

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }

    namespace Connection {
        interface Account {
            account_id: number
            account_id_ext: string
            email: string
            username: string
            password: string
            account_creation?: string
        }

        interface Token {
            content: string
        }
    }

    namespace Tokens {
        interface JSON extends User {

        }
    }

    interface AuthSocket extends Socket {
        user?: User
    }

    interface XX_User {
        id: string
        email?: string
        username?: string
        guest?: boolean
    }

    namespace Checkers {

        interface Player {
            user: User
            time_left?: number
        }

        interface Turn {
            player:  1 | 2 | null
            capture: boolean
            timestamp: number
            start: Checkers.Location
            end: Checkers.Location
        }

        interface Location{
            x: number
            y: number
        }
    }
}
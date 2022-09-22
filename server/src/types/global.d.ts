import {Socket} from "socket.io";

export {};

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }

    namespace Connection {
        interface Account {
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

    interface User {
        email: string
        username: string
    }

    namespace Checkers {

        interface Player {
            user: User
            time_left?: number
        }

        interface Turn {
            player:  1 | 2 | null
            hit: boolean
            start: Checkers.Location
            end: Checkers.Location
        }

        interface Location{
            x: number
            y: number
        }
    }
}
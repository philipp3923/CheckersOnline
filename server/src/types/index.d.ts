import {Socket} from "socket.io";

export {};

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }

    interface AuthSocket extends Socket{
        user?: User
    }

    interface User {
        email: string
    }
}
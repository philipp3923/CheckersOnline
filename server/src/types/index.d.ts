export {};

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
    interface User {
        email: string
    }
}
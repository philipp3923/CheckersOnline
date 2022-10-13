export {};

declare global{
  interface User {
    id: string
    role: Role
    email?: string
    username?: string
  }

  export enum Role {
    ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST"
  }

  export interface TokenObject {
    token: string,
    creation: number
  }
}

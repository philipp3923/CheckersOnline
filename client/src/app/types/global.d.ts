export {};

declare global{
  interface User {
    account_id: string
    role: Role
  }

  export enum Role {
    ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST"
  }

  export interface TokenObject {
    token: string,
    creation: number
  }
}

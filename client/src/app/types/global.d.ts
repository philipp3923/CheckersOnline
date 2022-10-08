export {};

declare global{
  interface User {
    id: string
    email?: string
    username?: string
    guest?: boolean
  }

  export interface TokenObject {
    token: string,
    creation: number
  }
}

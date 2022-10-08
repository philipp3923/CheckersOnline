export {};

declare global{
  interface User{
    id: string,
    email: string,
    username: string
  }

  export interface TokenObject {
    token: string,
    creation: number
  }
}

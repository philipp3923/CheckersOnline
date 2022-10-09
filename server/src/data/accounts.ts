
export interface Account{
    id: string,
    db_id: number,
    guest?: boolean,
}

export interface User extends Account{
    username: string
}
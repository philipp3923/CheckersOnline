export const MAX_TOKEN_COUNT: number = +(process.env.MAX_TOKEN_COUNT ?? 5);
export const MARIADB_HOST: string = process.env.MARIADB_HOST ?? "localhost";
export const MARIADB_PORT: number =  +(process.env.MARIADB_PORT ?? 3306);
export const MARIADB_USER: string | undefined = process.env.MARIADB_USER;
export const MARIADB_DATABASE: string | undefined = process.env.MARIADB_DATABASE;
export const MARIADB_PASSWORD: string | undefined = process.env.MARIADB_PASSWORD;
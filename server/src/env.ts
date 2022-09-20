export const MAX_TOKEN_COUNT: number = +(process.env.MAX_TOKEN_COUNT || 5);
export const MARIADB_HOST: string = process.env.MARIADB_HOST || "localhost";
export const MARIADB_PORT: number =  +(process.env.MARIADB_PORT || 3306);
export const MARIADB_USER: string | null = process.env.MARIADB_USER || null;
export const MARIADB_DB: string | null = process.env.MARAIADB_DB || null;
export const MARIADB_PASSWORD: string | null = process.env.MARIADB_PASSWORD || null;
import {MysqlError} from "mysql";
import {MARIADB_DATABASE, MARIADB_HOST, MARIADB_PASSWORD, MARIADB_PORT, MARIADB_USER} from "../env";

const mysql = require("mysql");

console.table({
    host: MARIADB_HOST,
    port: MARIADB_PORT,
    user: MARIADB_USER,
    database: MARIADB_DATABASE,
    password: MARIADB_PASSWORD,
});

const pool = mysql.createPool({
    host: MARIADB_HOST,
    port: MARIADB_PORT,
    user: MARIADB_USER,
    database: MARIADB_DATABASE,
    password: MARIADB_PASSWORD,
});

export function query(query_str: string, query_var: unknown[]): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        pool.query(query_str, query_var, function (err: MysqlError | null, rows: Object[]) {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}
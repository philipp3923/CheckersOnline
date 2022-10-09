import {MARIADB_DATABASE, MARIADB_HOST, MARIADB_PASSWORD, MARIADB_PORT, MARIADB_USER} from "../env";
import mysql, {MysqlError} from "mysql";

const pool = mysql.createPool({
    host: MARIADB_HOST,
    port: MARIADB_PORT,
    user: MARIADB_USER,
    database: MARIADB_DATABASE,
    password: MARIADB_PASSWORD,
});

console.log("MODULE: Database loaded");

const queries = {
    getAccount: "SELECT * FROM accounts WHERE ? = ?",
}

function query(query_str: string, query_var: unknown[]): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        pool.query(query_str, query_var, function (err: MysqlError | null, rows: Object[]) {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

interface Result_getAccount{

}
export function query_getAccount(attribute: string, value: string): Promise<Result_getAccount>{

}

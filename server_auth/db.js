const mysql = require("mysql");

const pool = mysql.createPool({
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    user: process.env.MARIADB_USER,
    database: process.env.MARIADB_DB,
    password: process.env.MARIADB_PASSWORD,
});

pool.on("error", (err) => {
    console.log(err);
});

function queryPromise(query_str, query_var) {
    return new Promise((resolve, reject) => {
        try {
            pool.query(query_str, query_var, function (err, rows) {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(rows);
            });
        } catch (err) {
            console.log(err);
            return reject(err);
        }
    });
}

module.exports = { queryPromise };

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

function query(query_str, query_var) {
    return new Promise((resolve, reject) => {
        pool.query(query_str, query_var, function (err, rows) {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

module.exports = { query };

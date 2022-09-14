const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    database: process.env.MARIADB_DB,
    password: process.env.MARIADB_PASSWORD,
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected to database");
  });
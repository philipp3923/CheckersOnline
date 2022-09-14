require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const db = require("./db");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/register", onRegister);
app.post("/login", onLogin);
app.post("/logout");
app.post("/refreshToken", onRefreshToken);

app.listen(5000, () => console.log("server_auth listening on port 5000"));

function onLogin(req, res) {}

async function onRegister(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(406);
    }

    let query_getAccount = "SELECT * FROM accounts WHERE email = ?;";

    await db
        .queryPromise(query_getAccount, [req.body.email])
        .then((rows) => {
            if (rows.length > 0) {
                return res.sendStatus(409);
            }
            console.log(rows);

            const salt = bcrypt.genSaltSync(10);
            const hashed_password = bcrypt.hashSync(req.body.password, salt);

            const user = {
                email: req.body.email,
            };

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            let query_insertAccount =
                "INSERT INTO accounts(email, password, account_creation) VALUES (?,?,NOW());";
            let query_insertToken =
                "INSERT INTO tokens(content, token_creation, account_id) VALUES (?, NOW(), (SELECT account_id FROM accounts WHERE email = ?))";

            db.queryPromise(query_insertAccount, [
                req.body.email,
                hashed_password,
            ])
                .then(() => {
                    db.queryPromise(query_insertToken, [
                        refreshToken,
                        req.body.email,
                    ]);
                })
                .catch((err) => {
                    console.log(err);
                });

            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

function onRefreshToken(req, res) {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
}

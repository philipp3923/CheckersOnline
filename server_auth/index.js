require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const db = require("./db");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/account/register", onRegister);
app.post("/account/login", onLogin);
app.delete("/account/logout");
app.delete("/account/delete");
app.post("/update/refreshToken", onRefreshToken);
app.post("/update/accessToken", onAccessToken);

app.listen(5000, () => console.log("server_auth listening on port 5000"));

async function onLogin(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(406);
    }

    let query_getAccount = "SELECT * FROM accounts WHERE email = ?;";

    await db
        .queryPromise(query_getAccount, [req.body.email])
        .then((rows) => {
            if (rows.length < 1) {
                return res.sendStatus(404);
            }
            if (rows.length > 1) {
                return res.sendStatus(500);
            }

            const account = rows[0];
            const verified = bcrypt.compareSync(
                req.body.password,
                account.password
            );

            if (!verified) {
                return res.sendStatus(403);
            }

            const user = {
                email: req.body.email,
            };

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

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

            const salt = bcrypt.genSaltSync(10);
            const hashed_password = bcrypt.hashSync(req.body.password, salt);

            const user = {
                email: req.body.email,
            };

            const query_insertAccount =
                "INSERT INTO accounts(email, password, account_creation) VALUES (?,?,NOW());";

            db.queryPromise(query_insertAccount, [
                req.body.email,
                hashed_password,
            ])
                .then((rows) => {
                    const accessToken = generateAccessToken(user);
                    const refreshToken = generateRefreshToken(user);

                    res.json({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
}

async function onRefreshToken(req, res) {
    const refreshToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken) return res.sendStatus(403);

    const decrypted_token = verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(409);

    console.log(decrypted_token);
    const user = {
        email: decrypted_token.email,
    };

    const newRefreshToken = generateRefreshToken(user);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?";

    db.queryPromise(query_deleteToken, [refreshToken]).catch((err) =>
        console.log(err)
    );

    res.json({
        refreshToken: newRefreshToken,
    });
}

async function onAccessToken(req, res) {}

function verifyRefreshToken(token) {
    try {
        var decrypted_token = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return false;
    }

    const query_getToken = "SELECT * FROM tokens WHERE content = ?";

    db.queryPromise(query_getToken, [token])
        .then((rows) => {
            if (rows.length != 1) {
                decrypted_token = false;
            }
        })
        .catch((err) => {
            console.log(err);
            decrypted_token = false;
        });

    return decrypted_token;
}

function generateRefreshToken(user) {
    const token = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });
    const query_insertToken =
        "INSERT INTO tokens(content, token_creation, account_id) VALUES (?, NOW(), (SELECT account_id FROM accounts WHERE email = ?))";

    db.queryPromise(query_insertToken, [token, user.email]).catch((err) => {
        console.log(err);
    });

    return token;
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
}

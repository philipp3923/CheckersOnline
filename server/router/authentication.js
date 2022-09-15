const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleError = require("../error");

const router = express.Router();

module.exports = router;

router.post("/account/register", handleError(onRegister));
router.post("/account/login", handleError(onLogin));
router.delete("/account/logout");
router.delete("/account/delete");
router.post("/update/refreshToken", onRefreshToken);
router.post("/update/accessToken", onAccessToken);

async function onLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE email = ?;";
    const query_result = await db.query(query_getAccount, [req.body.email]);

    if (query_result.length < 1) {
        return res.sendStatus(404);
    }
    if (query_result.length > 1) {
        throw "Query returned multiple users with same email address";
    }

    const account = query_result[0];
    const verified = await bcrypt.compare(req.body.password, account.password);


    if (!verified) {
        return res.sendStatus(403);
    }

    const user = {
        email: email,
    };

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });

    next();
}

async function onRegister(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(406);
    }

    let query_getAccount = "SELECT * FROM accounts WHERE email = ?;";

    await db
        .query(query_getAccount, [req.body.email])
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

            db.query(query_insertAccount, [req.body.email, hashed_password])
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
    console.log(refreshToken);
    if (!refreshToken) return res.sendStatus(403);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(409);

    console.log(decrypted_token);

    const user = {
        email: decrypted_token.email,
    };

    const newRefreshToken = generateRefreshToken(user);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    db.query(query_deleteToken, [refreshToken]).catch((err) =>
        console.log(err)
    );

    res.json({
        refreshToken: newRefreshToken,
    });
}

async function onAccessToken(req, res) {}

async function verifyRefreshToken(token) {
    const start = performance.now();
    try {
        var decrypted_token = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return false;
    }
    console.log("Token verification time: " + (performance.now()-start));

    const query_getToken = "SELECT * FROM tokens WHERE content = ?";

    await db
        .query(query_getToken, [token])
        .then((rows) => {
            console.log("ROWS:" + rows);
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

async function generateRefreshToken(user) {
    const token = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });
    const query_insertToken =
        "INSERT INTO tokens(content, token_creation, account_id) VALUES (?, NOW(), (SELECT account_id FROM accounts WHERE email = ?))";

    db.query(query_insertToken, [token, user.email]);

    return token;
}

async function generateAccessToken(user) {
    const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "30m",
    });
    return token;
}

const express = require("express");
const db = require("../database/connection");
const bcrypt = require("bcrypt");

const handleError = require("../error");
const verifyTokens = require("../tokens/verify");
const generateTokens = require("../tokens/generate");

const router = express.Router();

router.post("/register", handleError(onRegister));
router.post("/login", handleError(onLogin));
router.post("/logout", handleError(onLogout));
router.post("/update/refreshToken", handleError(onRefreshToken));
router.post("/update/accessToken", handleError(onAccessToken));

async function onLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE email = ?;";
    const result_getAccount = await db.query(query_getAccount, [
        req.body.email,
    ]);

    if (result_getAccount.length < 1) {
        return res.sendStatus(404);
    }
    if (result_getAccount.length > 1) {
        throw "Query returned multiple users with same email address";
    }

    const account = result_getAccount[0];
    const verified = await bcrypt.compare(req.body.password, account.password);

    if (!verified) {
        return res.sendStatus(403);
    }

    const user = {
        email: email,
    };

    const accessToken = await generateTokens.generateAccessToken(user);
    const refreshToken = await generateTokens.generateRefreshToken(user);

    cleanUpTokens(user);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });

    next();
}

async function onRegister(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE email = ?;";

    const result_getAccount = await db.query(query_getAccount, [email]);

    if (result_getAccount.length > 0) {
        return res.sendStatus(409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const user = {
        email: email,
    };

    const query_insertAccount =
        "INSERT INTO accounts(email, password, account_creation) VALUES (?,?,NOW());";

    const result_insertAccount = await db.query(query_insertAccount, [
        req.body.email,
        hashed_password,
    ]);

    const accessToken = await generateTokens.generateAccessToken(user);
    const refreshToken = await generateTokens.generateRefreshToken(user);

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });

    next();
}

async function onLogout(req, res, next) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyTokens.verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);
    
    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    db.query(query_deleteToken, [refreshToken]);

    res.sendStatus(200);

    next();
}

async function onRefreshToken(req, res, next) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyTokens.verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const user = {
        email: decrypted_token.email,
    };

    const newRefreshToken = await generateTokens.generateRefreshToken(user);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    db.query(query_deleteToken, [refreshToken]);

    res.json({
        refreshToken: newRefreshToken,
    });

    next();
}

async function onAccessToken(req, res, next) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyTokens.verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const user = {
        email: decrypted_token.email,
    };

    const newAccessToken = await generateTokens.generateAccessToken(user);

    res.json({
        accessToken: newAccessToken,
    });

    next();
}

async function cleanUpTokens(user) {
    return Promise.resolve().then(async () => {
        const query_getTokens =
            "SELECT content, token_creation FROM tokens WHERE account_id = (SELECT account_id FROM accounts WHERE email = ?) ORDER BY token_creation;";

        const result_getTokens = await db.query(query_getTokens, [user.email]);

        for (
            let i = 0;
            i < result_getTokens.length - process.env.MAX_TOKEN_COUNT;
            i++
        ) {
            const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

            db.query(query_deleteToken, [result_getTokens[i].content]);
        }
    });
}

module.exports = router;
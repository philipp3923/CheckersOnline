const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleError = require("../error");

const router = express.Router();

module.exports = router;

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

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

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

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });

    next();
}

async function onLogout(req, res, next) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);
    
    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    db.query(query_deleteToken, [refreshToken]);

    res.sendStatus(200);

    next();
}

async function onRefreshToken(req, res, next) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    console.log(decrypted_token);

    const user = {
        email: decrypted_token.email,
    };

    const newRefreshToken = await generateRefreshToken(user);

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

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);
    const user = {
        email: decrypted_token.email,
    };

    const newAccessToken = await generateAccessToken(user);

    res.json({
        accessToken: newAccessToken,
    });

    next();
}

async function verifyRefreshToken(token) {
    try {
        var decrypted_token = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return false;
    }

    const query_getToken = "SELECT * FROM tokens WHERE content = ?";

    const result_getToken = await db.query(query_getToken, [token]);

    if (result_getToken.length != 1) {
        decrypted_token = false;
    }

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

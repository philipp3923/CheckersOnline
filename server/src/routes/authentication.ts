import {NextFunction, Request, Response} from "express";
import {MAX_TOKEN_COUNT} from "../env";
import {generateAccessToken, generateRefreshToken} from "../tokens/generate";
import {verifyRefreshToken} from "../tokens/verify";
import {query} from "../database/connection";
import Account from "../types/sql/Account";
import Token from "../types/sql/Token";
import {compare, genSalt, hash} from "bcrypt";

const express = require("express");
const router = express.Router();

router.post("/register", onRegister);
router.post("/login", onLogin);
router.post("/logout", onLogout);
router.post("/update/refreshToken", onRefreshToken);
router.post("/update/accessToken", onAccessToken);

async function onLogin(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE email = ?;";
    const result_getAccount= <Account[]> await query(query_getAccount, [
        req.body.email,
    ]);

    if (result_getAccount.length < 1) {
        return res.sendStatus(404);
    }
    if (result_getAccount.length > 1) {
        throw "Query returned multiple users with same email address";
    }

    const account = result_getAccount[0];
    const verified = await compare(req.body.password, account.password);

    if (!verified) {
        return res.sendStatus(403);
    }

    const user = {
        email: email,
    };

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    cleanUpTokens(user);

    res.json({accessToken: accessToken, refreshToken: refreshToken});

    next();
}

async function onRegister(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE email = ?;";

    const result_getAccount = await query(query_getAccount, [email]);

    if (result_getAccount.length > 0) {
        return res.sendStatus(409);
    }

    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);

    const user = {
        email: email,
    };

    const query_insertAccount =
        "INSERT INTO accounts(email, password, account_creation) VALUES (?,?,NOW());";

    await query(query_insertAccount, [
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

async function onLogout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    query(query_deleteToken, [refreshToken]);

    res.sendStatus(200);

    next();
}

async function onRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const user = {
        email: decrypted_token.email,
    };

    const newRefreshToken = await generateRefreshToken(user);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    query(query_deleteToken, [refreshToken]);

    res.json({
        refreshToken: newRefreshToken,
    });

    next();
}

async function onAccessToken(req: Request, res: Response, next: NextFunction) {
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

async function cleanUpTokens(user: User) {
    return Promise.resolve().then(async () => {
        const query_getTokens =
            "SELECT content, token_creation FROM tokens WHERE account_id = (SELECT account_id FROM accounts WHERE email = ?) ORDER BY token_creation;";

        const result_getTokens = <Token[]> await query(query_getTokens, [user.email]);

        for (
            let i = 0;
            i < result_getTokens.length - MAX_TOKEN_COUNT;
            i++
        ) {
            const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

            query(query_deleteToken, [result_getTokens[i].content]);
        }
    });
}

export default router;
import {NextFunction, Request, Response} from "express";
import {MAX_TOKEN_COUNT} from "../env";
import {generateAccessToken, generateRefreshToken} from "../tokens/generate";
import {verifyRefreshToken} from "../tokens/verify";
import {query} from "../database/SQLConnection";
import {compare, genSalt, hash} from "bcrypt";
import tokenToUser from "../utils/TokenToUser";
import {generate_pad, generate_random} from "../utils/KeyGeneration";

const express = require("express");
const router = express.Router();

router.post("/register", post_register);
router.post("/login", post_login);
router.post("/logout", post_logout);
router.post("/update/refresh_token", post_refreshToken);
router.post("/update/access_token", post_accessToken);
router.get("/username_available", get_usernameAvailable);

async function get_usernameAvailable(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    if (!username) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE username = ?;";
    const result_getAccount = <Connection.Account[]>await query(query_getAccount, [
        username,
    ]);

    res.json({exists: result_getAccount.length > 0});

    next();
}

async function post_login(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400);
    }

    const query_getAccount = "SELECT * FROM accounts WHERE email = ?;";
    const result_getAccount = <Connection.Account[]>await query(query_getAccount, [
        email,
    ]);

    if (result_getAccount.length < 1) {
        return res.sendStatus(404);
    }
    if (result_getAccount.length > 1) {
        throw "Query returned multiple users with same email address";
    }

    const account = result_getAccount[0];
    const verified = await compare(password, account.password);

    if (!verified) {
        return res.sendStatus(403);
    }

    console.log(account);

    console.log(account.account_id_ext);

    const user: User = {
        id: account.account_id_ext,
        email: email,
        username: account.username + "ASLLLLLLL",
    };

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    cleanUpTokens(user);

    const query_updateAccount =
        "UPDATE accounts SET last_login = NOW() WHERE email = ?;";

    query(query_updateAccount, [
        email
    ]);

    res.json({accessToken: accessToken, refreshToken: refreshToken, user: user});

    next();
}

async function post_register(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if (!email || !password || !username) {
        return res.status(400);
    }

    let query_getAccount = "SELECT * FROM accounts WHERE email = ? OR username = ?;";

    let result_getAccount = await query(query_getAccount, [email, username]);

    if (result_getAccount.length > 0) {
        return res.sendStatus(409);
    }

    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);


    const query_insertAccount =
        "INSERT INTO accounts(email, username, password, account_creation, last_login) VALUES (?,?,?,NOW(), NOW());";
    query_getAccount = "SELECT * FROM accounts WHERE email = ?;";
    const query_updateUserID = "UPDATE accounts SET account_id_ext = ? WHERE account_id = ?;";

    await query(query_insertAccount, [
        email,
        username,
        hashed_password,
    ]);

    const account = (<Connection.Account[]>await query(query_getAccount, [email]))[0];
    const user_id = (generate_pad(account.account_id.toString(36), 6) + generate_pad(generate_random(0, 1679616).toString(36), 4)).toUpperCase();

    query(query_updateUserID, [user_id, account.account_id]);

    const user: User = {
        id: user_id,
        email: email,
        username: username,
    };
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user
    });

    next();
}

async function post_logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    query(query_deleteToken, [refreshToken]);

    res.sendStatus(200);

    next();
}

async function post_refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const user = tokenToUser(decrypted_token);

    const newRefreshToken = await generateRefreshToken(user);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    query(query_deleteToken, [refreshToken]);

    res.json({
        refreshToken: newRefreshToken,
    });

    next();
}

async function post_accessToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await verifyRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const user: User = tokenToUser(decrypted_token);

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

        const result_getTokens = <Connection.Token[]>await query(query_getTokens, [user.email]);

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
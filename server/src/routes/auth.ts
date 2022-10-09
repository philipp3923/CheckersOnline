import e, {NextFunction, Request, Response} from "express";
import {DecryptedToken, decryptRefreshToken, encryptAccessToken, encryptRefreshToken} from "../data/tokens";
import {compare, genSalt, hash} from "bcrypt";
import {generate_guestid, generate_pad, generate_random, generate_userid} from "../utils/KeyGeneration";
import prisma from "../db/client";

//#TODO move constant to central file
const MAX_TOKEN_COUNT = 10;

const express = require("express");
const router = express.Router();

router.post("/register", post_register);
router.post("/login", post_login);
router.post("/logout", post_logout);
router.post("/guest", post_guest);
router.post("/update/refresh_token", post_refreshToken);
router.post("/update/access_token", post_accessToken);
router.get("/username_available", get_usernameAvailable);


async function get_usernameAvailable(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    if (!username) {
        return res.sendStatus(400);
    }

    const account = await prisma.users.findFirst({where: {username: username}});

    res.json({exists: account === null});

    next();
}

async function post_login(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if ((!email && !username) || !password) {
        return res.sendStatus(400);
    }

    const user  = await prisma.users.findFirst({where: {OR: [{email: email}, {username: username}]}, include: {accounts: {}}});

    if (user === null) {
        return res.sendStatus(404);
    }

    const verified = await compare(password, user.password);

    if (!verified) {
        return res.sendStatus(403);
    }

    const decryptedToken: DecryptedToken = {
        account_id: user.accounts.ext_id,
    }

    const accessToken = await encryptAccessToken(decryptedToken);
    const refreshToken = await encryptRefreshToken(decryptedToken);

    cleanUpTokens(user.accounts.id);

    prisma.accounts.update({data: {last_login: new Date()}, where : {id: user.id}})

    res.json({accessToken: accessToken, refreshToken: refreshToken, account: {id: user.accounts.ext_id}});

    next();
}

async function post_register(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if (!email || !password || !username) {
        return res.sendStatus(400);
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
    const user_id = generate_userid(account.account_id);
    query(query_updateUserID, [user_id, account.account_id]);

    const user: User = {
        id: user_id,
        email: email,
        username: username,
    };
    const accessToken = await encryptAccessToken(user);
    const refreshToken = await encryptRefreshToken(user);

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user
    });

    next();
}

async function post_guest(req: Request, res: Response, next: NextFunction) {

    const decryptedToken: DecryptedToken = {
        account_id: generate_guestid(),
        guest: true,
    };

    while(prisma.accounts.findFirst({where: {ext_id: decryptedToken.account_id}}) !== null){
        decryptedToken.account_id = generate_guestid();
        console.log("WARNING: account.ext_id generation collision at guest!");
    }

    prisma.accounts.create({data: {ext_id: decryptedToken.account_id, guest: true, active: true}});

    const accessToken = await encryptAccessToken(decryptedToken);
    const refreshToken = await encryptRefreshToken(decryptedToken);

    res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        account: {id: decryptedToken.account_id}
    });

    next();
}

async function post_logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await decryptRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

    query(query_deleteToken, [refreshToken]);

    res.sendStatus(200);

    next();
}

async function post_refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await decryptRefreshToken(refreshToken);

    if (!decrypted_token) return res.sendStatus(403);

    const user = tokenToUser(decrypted_token);

    const newRefreshToken = await encryptRefreshToken(user);

    if(!user.guest) {
        const query_deleteToken = "DELETE FROM tokens WHERE content = ?;";

        query(query_deleteToken, [refreshToken]);

    }

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

    const newAccessToken = await encryptAccessToken(user);

    res.json({
        accessToken: newAccessToken,
    });

    next();
}

async function cleanUpTokens(account_id: number) {

    const tokens = await prisma.refresh_tokens.findMany({where: {id_accounts: account_id}, orderBy: {creation: "desc"}});

    for (let i = 0; i < tokens.length - MAX_TOKEN_COUNT; i++) {
        prisma.refresh_tokens.delete({where: {id: tokens[i].id}});
    }
}

export default router;
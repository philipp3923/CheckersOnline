import {NextFunction, Request, Response} from "express";
import {
    DecryptedToken,
    decryptRefreshToken,
    encryptAccessToken,
    encryptRefreshToken,
    Role,
    saveRefreshToken,
    updateRefreshToken
} from "../data/tokens";
import {compare, genSalt, hash} from "bcrypt";
import {generate_guestid, generate_userid} from "../utils/idGenerator";
import prisma from "../db/client";
import logmsg, {loghttp, LogStatus, LogType} from "../utils/logmsg";

const express = require("express");
const router = express.Router();

/*
router.post("/register", post_register, post_login);
router.post("/login", post_login);
router.post("/logout", post_logout);
router.post("/guest", post_guest);
router.post("/update/refresh_token", post_refreshToken);
router.post("/update/access_token", post_accessToken);
router.get("/username_available", get_usernameAvailable);
*/

async function get_usernameAvailable(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    if (!username) {
        return res.sendStatus(400);
    }

    const user = await prisma.user.findUnique({where: {username: username}});

    res.json({exists: user === null});

    loghttp(req, LogStatus.SUCCESS, {username});
    next();
}

async function post_login(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if ((!email && !username) || !password) {
        return res.sendStatus(400);
    }

    const user = await prisma.user.findFirst({
        where: {OR: [{email: email}, {username: username}]}, include: {account: {}}
    });

    if (user === null) {
        return res.sendStatus(404);
    }

    const verified = await compare(password, user.password);

    if (!verified) {
        loghttp(req, LogStatus.FAILED, {email, username}, "wrong password");
        return res.sendStatus(403);
    }

    const decryptedToken: DecryptedToken = {
        account_id: user.account.ext_id,
        role: Role.USER,
    }

    const accessToken = await encryptAccessToken(decryptedToken);
    const refreshToken = await encryptRefreshToken(decryptedToken);

    saveRefreshToken(user.account.id, refreshToken.token);

    prisma.account.update({data: {loginAt: new Date()}, where: {id: user.id}})

    res.json({accessToken: accessToken, refreshToken: refreshToken, account: {id: user.account.ext_id, username: user.username, email: user.email}});

    loghttp(req, LogStatus.SUCCESS, {id: user.account.ext_id, email: email, username: username});
    next();
}

async function post_register(req: Request, res: Response, next: NextFunction) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    if (!email || !password || !username) {
        return res.sendStatus(400);
    }


    //#TODO check password quality

    const existing_user = await prisma.user.findFirst({
        where: {OR: [{email: email}, {username: username}]}, include: {account: {}}
    });

    if (existing_user !== null) {
        return res.sendStatus(409);
    }

    const salt = await genSalt(10);
    const hashed_password = await hash(password, salt);
    let account_id: string = generate_userid();

    while (await prisma.account.findUnique({where: {ext_id: account_id}}) !== null) {
        account_id = generate_userid();
        logmsg(LogType.DB, LogStatus.WARNING, "account.ext_id generation collision at register");
    }

    const account = await prisma.account.create({data: {ext_id: account_id, active: true, role: Role.USER}});
    const user = await prisma.user.create({data: {username: username, email: email, password: hashed_password, account: {connect: {id: account.id}}}});

    loghttp(req, LogStatus.SUCCESS, {id: account.ext_id, email: email, username: username});
    next();
}

async function post_guest(req: Request, res: Response, next: NextFunction) {
    const decryptedToken: DecryptedToken = {
        account_id: generate_guestid(), role: Role.GUEST,
    };

    while (await prisma.account.findUnique({where: {ext_id: decryptedToken.account_id}}) !== null) {
        decryptedToken.account_id = generate_guestid();
        logmsg(LogType.DB, LogStatus.WARNING, "account.ext_id generation collision at guest");
    }

    prisma.account.create({data: {ext_id: decryptedToken.account_id, role: Role.GUEST, active: true}});

    const accessToken = await encryptAccessToken(decryptedToken);
    const refreshToken = await encryptRefreshToken(decryptedToken);

    res.json({
        accessToken: accessToken, refreshToken: refreshToken, account: {id: decryptedToken.account_id}
    });

    loghttp(req, LogStatus.SUCCESS, {id: decryptedToken.account_id});
    next();
}

async function post_logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await decryptRefreshToken(refreshToken);

    if (!decrypted_token) {
        loghttp(req, LogStatus.WARNING, {}, "invalid token submitted");
        return res.sendStatus(403)
    }

    if (decrypted_token.role === Role.GUEST) {
        return res.sendStatus(400);
    }

    prisma.refreshToken.delete({where: {content: refreshToken}});

    res.sendStatus(200);

    loghttp(req, LogStatus.SUCCESS, {id: decrypted_token.account_id});
    next();
}

async function post_refreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await decryptRefreshToken(refreshToken);

    if (!decrypted_token) {
        loghttp(req, LogStatus.WARNING, undefined, "invalid token submitted");
        return res.sendStatus(403);
    }

    const newRefreshToken = await encryptRefreshToken(decrypted_token);

    if (decrypted_token.role !== Role.GUEST) {
        updateRefreshToken(refreshToken, newRefreshToken.token);
    }

    res.json({
        refreshToken: newRefreshToken,
    });

    next();
}

async function post_accessToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    if (!refreshToken) return res.sendStatus(401);

    const decrypted_token = await decryptRefreshToken(refreshToken);

    if (!decrypted_token) {
        loghttp(req, LogStatus.WARNING, {}, "invalid token submitted");
        return res.sendStatus(403);
    }

    const encryptedToken = await encryptAccessToken(decrypted_token);

    res.json({
        accessToken: encryptedToken,
    });

    next();
}

export default router;
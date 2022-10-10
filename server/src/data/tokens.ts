import prisma from "../db/client";
import jwt from "jsonwebtoken";
import logmsg, {LogStatus, LogType} from "../utils/logmsg";

//#TODO move constants to central file
const JWT_REFRESH_SECRET = "aNMkyXrdEgGCQw6OpdnTsh1XEEKb5pbMaA1mfEfGLD6GHyAQriU4qWVsbpp5RsMCXIiCT27LnDCb72OUUX6xFCmdp1rB1eSxlW6A6XVZeprS681oFLaEKnWQOAQsNEhY";
const JWT_ACCESS_SECRET = "ZdTytDiVUWcSfVh62VfiQ5mcV3JCT6exTHTNCOZH9XOdMXft82UiMToVtyfIsOenSE5BAullDJJqwOJSVVN1pvSsyOfjK7w8pLzgtznLxp5rGUG58D17rS7Ryltf8yIA";
const JWT_TOKEN_COUNT = 10;

export enum Role {
    ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST"
}
export interface DecryptedToken {
    account_id: string,
    role: Role,
    iat?: number,
    exp?: number
}

export interface EncryptedToken {
    token: string,
    creation: number
}

export async function decryptRefreshToken(token: string): Promise<DecryptedToken | null> {
    let decryptedToken: DecryptedToken;

    try {
        decryptedToken = <DecryptedToken>jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
        return null;
    }

    if (decryptedToken.role !== Role.GUEST) {
        const db_token = await prisma.refreshToken.findFirst({where: {content: token}});

        if (db_token === null) {
            return null;
        }
    }

    delete decryptedToken.iat;
    delete decryptedToken.exp;
    return decryptedToken;
}

export async function decryptAccessToken(token: string): Promise<DecryptedToken | null> {
    try {
        const decryptedToken = <DecryptedToken>jwt.verify(token, JWT_ACCESS_SECRET);
        delete decryptedToken.iat;
        delete decryptedToken.exp;
        return decryptedToken;
    } catch (err) {
        return null;
    }
}

export async function encryptAccessToken(decryptedToken: DecryptedToken): Promise<EncryptedToken> {
    delete decryptedToken.iat;
    delete decryptedToken.exp;

    const encryptedToken = jwt.sign({...decryptedToken}, JWT_ACCESS_SECRET, {
        expiresIn: "30m",
    });

    return {token: encryptedToken, creation: Date.now() - 5000};
}

export async function encryptRefreshToken(decryptedToken: DecryptedToken): Promise<EncryptedToken> {
    delete decryptedToken.iat;
    delete decryptedToken.exp;

    const encryptedToken: string = jwt.sign({...decryptedToken}, JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });

    return {token: encryptedToken, creation: Date.now() - 5000};
}

export async function updateRefreshToken(oldToken: string, newToken: string) {
    await prisma.refreshToken.update({data: {content: newToken}, where: {content: oldToken}});
}

export async function saveRefreshToken(id_account: number, token: string) {
    try {
        await prisma.refreshToken.create({data: {content: token, id_account: id_account}});
    }catch (e){
        logmsg(LogType.DB, LogStatus.WARNING, "refreshToken was already in Database");
    }
    await cleanUpRefreshTokens(id_account);
}

async function cleanUpRefreshTokens(id_account: number) {

    const tokens = await prisma.refreshToken.findMany({where: {id_account: id_account}, orderBy: {createdAt: "asc"}});

    for (let i = 0; i < tokens.length - JWT_TOKEN_COUNT; i++) {
        await prisma.refreshToken.delete({where: {id: tokens[i].id}});
    }
}
import prisma from "../db/client";

const db = require("../database/SQLConnection");
const jwt = require("jsonwebtoken");

//#TODO move constants to central file
const JWT_REFRESH_SECRET = "aNMkyXrdEgGCQw6OpdnTsh1XEEKb5pbMaA1mfEfGLD6GHyAQriU4qWVsbpp5RsMCXIiCT27LnDCb72OUUX6xFCmdp1rB1eSxlW6A6XVZeprS681oFLaEKnWQOAQsNEhY";
const JWT_ACCESS_SECRET = "ZdTytDiVUWcSfVh62VfiQ5mcV3JCT6exTHTNCOZH9XOdMXft82UiMToVtyfIsOenSE5BAullDJJqwOJSVVN1pvSsyOfjK7w8pLzgtznLxp5rGUG58D17rS7Ryltf8yIA";


export interface DecryptedToken {
    account_id: string,
    guest?: boolean
}

export interface EncryptedToken {
    token: string,
    creation: number,
}

export async function decryptRefreshToken(token: string): Promise<DecryptedToken | null> {
    let decrypted_token: DecryptedToken;

    try {
        decrypted_token = <DecryptedToken>jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
        return null;
    }

    if (!decrypted_token.guest) {
        const db_token = await prisma.refresh_tokens.findFirst({where: {content: token}});

        if (db_token === null) {
            return null;
        }
    }

    return decrypted_token;
}

export async function decryptAccessToken(token: string): Promise<DecryptedToken | null> {
    try {
        return <DecryptedToken>jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
        return null;
    }
}


export async function encryptAccessToken(decryptedToken: DecryptedToken): Promise<EncryptedToken> {
    return {
        token: jwt.sign(decryptedToken, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "30m",
        }),
        creation: Date.now() - 5000
    };
}

export async function encryptRefreshToken(decryptedToken: DecryptedToken): Promise<EncryptedToken> {
    const encryptedToken: string = jwt.sign(decryptedToken, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });

    if (!decryptedToken.guest) {
        const account = await prisma.accounts.findFirst({where: {ext_id: decryptedToken.account_id}});

        if (account === null) {
            throw new Error("Account does not exist. ext_id: " + decryptedToken.account_id);
        }

        prisma.refresh_tokens.create({
            data: {
                content: encryptedToken, id_accounts: account.id
            }
        });
    }

    return {token: encryptedToken, creation: Date.now() - 5000};
}

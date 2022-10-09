import {JwtPayload} from "jsonwebtoken";

const db = require("../database/SQLConnection");
const jwt = require("jsonwebtoken");

export async function verifyRefreshToken(token: string): Promise<Tokens.JSON | null> {
    let decrypted_token: Tokens.JSON;

    try {
        decrypted_token = <Tokens.JSON>jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return null;
    }

    if(!decrypted_token.guest) {
        const query_getToken = "SELECT * FROM tokens WHERE content = ?";

        const result_getToken = await db.query(query_getToken, [token]).catch((err: Error) => {
            console.log(err);
        });

        if (result_getToken.length != 1) {
            return null;
        }
    }

    return decrypted_token;
}

export async function verifyAccessToken(token: string): Promise<Tokens.JSON | null> {
    try {
        return <Tokens.JSON> jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
        return null;
    }
}
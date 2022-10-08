const db = require("../database/SQLConnection");
const jwt = require("jsonwebtoken");

export interface TokenObject {
    token: string,
    creation: number
}

export async function generateAccessToken(user: User): Promise<TokenObject> {
    return {
        token: jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "30m",
        }),
        creation: Date.now()-5000
    };
}

export async function generateRefreshToken(user: User): Promise<TokenObject> {
    const token: string = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });
    const query_insertToken =
        "INSERT INTO tokens(content, token_creation, account_id) VALUES (?, NOW(), (SELECT account_id FROM accounts WHERE email = ?))";

    db.query(query_insertToken, [token, user.email]);

    return {token: token, creation: Date.now()-5000};
}
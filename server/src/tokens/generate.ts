const db = require("../database/SQLConnection");
const jwt = require("jsonwebtoken");

export async function generateAccessToken(user: User) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "30m",
    });
}

export async function generateRefreshToken(user: User) {
    const token: string = jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });
    const query_insertToken =
        "INSERT INTO tokens(content, token_creation, account_id) VALUES (?, NOW(), (SELECT account_id FROM accounts WHERE email = ?))";

    db.query(query_insertToken, [token, user.email]);

    return token;
}
const db = require("../database/connection");
const jwt = require("jsonwebtoken");

async function generateAccessToken(user) {
    const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "30m",
    });
    return token;
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

module.exports = {generateRefreshToken, generateAccessToken};
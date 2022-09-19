const db = require("../database/connection");
const jwt = require("jsonwebtoken");

async function verifyRefreshToken(token) {
    try {
        var decrypted_token = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        return false;
    }

    const query_getToken = "SELECT * FROM tokens WHERE content = ?";

    const result_getToken = await db.query(query_getToken, [token]);

    if (result_getToken.length != 1) {
        decrypted_token = false;
    }

    return decrypted_token;
}

async function verifyAccessToken(token) {
    try {
        var decrypted_token = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return decrypted_token;
    } catch (err) {
        return false;
    }
}

module.exports = {verifyAccessToken, verifyRefreshToken};
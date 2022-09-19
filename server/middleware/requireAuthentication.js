const jwt = require("jsonwebtoken");

function requireAuthentication(req, res, next) {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.sendStatus(401);

    try {
        var decrypted_token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
        return res.sendStatus(403);
    }

    console.log(decrypted_token);

    req.user = {
        email: decrypted_token.email,
    };

    next();
}

module.exports = requireAuthentication;

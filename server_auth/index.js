require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());

app.post("/register");
app.post("/login", onLogin);
app.post("/logout");
app.post("/refreshToken", onRefreshToken);

app.listen(5000, () => console.log("server_auth listening on port 5000"));

function onLogin(req, res) {
    if (!req.body.email || !req.body.password) {
        return res.sendStatus(406);
    }

    //auth user in db and get public_id !
    const user = {
        email: req.body.email,
        public_id: "RANDOM_STRING",
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
}

function onRefreshToken(req, res){
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET);
}

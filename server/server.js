require("dotenv").config();

const express = require("express");
const app = express();

const authRouter = require("./router/authentication");

app.use(express.json());

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }

    console.log("====================");
    console.log(err);
    console.log("====================");
    res.status(500);
});

app.listen(5000, () => console.log("server_auth listening on port 5000"));

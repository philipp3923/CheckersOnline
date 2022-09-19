require("dotenv").config();

const express = require("express");
const app = express();

const authRouter = require("./routes/authentication");

app.use(express.json());

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
    if (!err) {
        return next();
    }

    console.log("====================");
    console.table(req);
    console.log("--------------------");
    console.log(err);
    console.log("====================");
    res.status(500);
});

app.listen(5000, () => console.log("server listening on port 5000"));

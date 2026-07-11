const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const deviceInfo = require("./src/deviceInfo");
const connectDB = require("./src/config/db");

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        error: "Trop de requêtes, veuillez réessayer plus tard.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const PORT = process.env.PORT || 3001;

app
    .use(helmet())
    .use(
        cors({
            allowedHeaders: [
                "x_apiKey",
                "Content-Type",
                "authorization",
            ],
        })
    )
    .use(bodyParser.json({ limit: "10mb" }))
    .use(hpp())
    .use(limiter)
    .use(deviceInfo)
    .use(express.urlencoded({ extended: false }))
    .use("/ai", require("./src/bot/routes"))
    .use('/s',require("./src/security.routes"))
    .get("/", (req, res) => {
        res.status(200).json({ success: true, msg: "Yo ! On dit quoi ?" });
    })
   
connectDB()
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
require("dotenv").config();

const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");

const Filter = require("./filter");
const SecurityLog = require("../models/securityLog.model");

router.post("/", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required." });

        const start = Date.now();
        let decision = JSON.parse(await Filter(prompt));
        const analysisDuration = Date.now() - start;

        await SecurityLog.create({
            requestId: crypto.randomUUID(),
            user: {
                id: req.user?._id || null,
                email: req.user?.email || null
            },
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            prompt,
            status: decision.status,
            riskScore: decision.riskScore,
            attackCategory: decision.attackCategory,
            triggeredRules: decision.triggeredRules,
            aiDecision: decision,
            analysisDuration,
            action: decision.isMalicious ? "blocked" : "forwarded"
        });

        if (decision.isMalicious) {
            return res.status(403).json({
                success: false,
                message: decision.reason,
                category: decision.attackCategory,
                riskScore: decision.riskScore,
                confidence: decision.confidence
            });
        }

        const { data } = await axios.post(`${process.env.AI_LAB}/agent`, { prompt });
        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});

module.exports = router;
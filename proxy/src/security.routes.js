const router = require("express").Router();
const SecurityLog = require("./models/securityLog.model");

router.get("/stats", async (req, res) => {
    try {
        const [totalRequests, allowedRequests, blockedRequests, averageRisk] = await Promise.all([
            SecurityLog.countDocuments(),
            SecurityLog.countDocuments({ status: "allowed" }),
            SecurityLog.countDocuments({ status: "blocked" }),
            SecurityLog.aggregate([
                {
                    $group: {
                        _id: null,
                        averageRiskScore: { $avg: "$riskScore" }
                    }
                }
            ])
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRequests,
                allowedRequests,
                blockedRequests,
                averageRiskScore: averageRisk.length ? Math.round(averageRisk[0].averageRiskScore) : 0
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/logs/recent", async (req, res) => {
    try {
        const logs = await SecurityLog.find()
            .select("requestId prompt status riskScore attackCategory createdAt")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
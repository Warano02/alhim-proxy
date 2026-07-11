const router = require("express").Router();
const SecurityLog = require("./models/securityLog.model");


router.get("/logs/recent", async (req, res) => {
    try {
        const logs = await SecurityLog.find({
            status: "blocked"
        })
        .sort({
            createdAt: -1
        })
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
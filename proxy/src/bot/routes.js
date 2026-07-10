const Filter = require("./filter")

const router = require("express").Router()

router.post("/", (req, res) => {
    try {
        const { prompt } = req?.body
        if (!prompt) return res.status(409).json({ error: true, msg: "Invalid payload !" })
        const analyse = await Filter(prompt)
        if (analyse.violation) return res.status(403).json({ err: true, msg: analyse?.rationale||"this message have injection ", injection: analyse.category || "" })

            //Forward request to real API

        res.json({error:false,msg:"Request tranfert to real api "})
    } catch (e) {
        console.log("Error occured while trying to solve prompt  injection in the request  ", e)
        return res.json({ msg: "Ta maman mola !" })
    }
})

module.exports = router
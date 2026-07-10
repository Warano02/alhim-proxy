const Filter = require("./filter")

const router = require("express").Router()

router.post("/", async (req, res) => {
    try {
        const { prompt } = req?.body
        if (!prompt) return res.status(409).json({ error: true, msg: "Invalid payload !" })
        let analyse = await Filter(prompt)
        analyse = JSON.parse(analyse)
        // console.log(typeof analyse, analyse)

        if (analyse.violation) return res.status(403).json({ err: true, msg: analyse?.rationale || "this message have injection ", injection: analyse.category || "" })

        //Forward request to real API

        res.json({ error: false, msg: "Request tranfert to real api " })
    } catch (e) {
        console.log("Error occured while trying to solve prompt  injection in the request  ", e)
        return res.json({ msg: "Ta maman mola !" })
    }
})

module.exports = router
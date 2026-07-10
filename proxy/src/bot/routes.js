const Filter = require("./filter")

const router = require("express").Router()

router.post("/", (req, res) => {
    try {
        const { prompt } = req?.body
        if (!prompt) return res.status(409).json({ error: true, msg: "Invalid payload !" })
        const analyse = await Filter(prompt)
        if (analyse.isDanger) return res.status(403).json({ err: true, msg: "this message have injection ", injection: analyse.danger || "" })
        // forward request

    } catch (e) {
        console.log("Error occured while trying to solve prompt  injection in the request  ", e)
        return res.json({ msg: "Ta maman mola !" })
    }
})

module.exports = router
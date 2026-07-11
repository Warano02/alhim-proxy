require("dotenv").config()
const router = require("express").Router()
const axios = require("axios")
const Filter = require("./filter")

router.post("/", async (req, res) => {
    try {
        const { prompt } = req?.body
        if (!prompt) return res.status(409).json({ error: true, msg: "Invalid payload !" })
        let analyse = await Filter(prompt)
        analyse = JSON.parse(analyse)
        // console.log(typeof analyse, analyse)

        if (analyse.violation) return res.status(403).json({ err: true, msg: analyse?.rationale || "this message have injection ", injection: analyse.category || "" })

        //Forward request to real API
        const { data: response } = await axios.post(process.env.AI_LAB + "/agent", { prompt })

        res.json(response)
    } catch (e) {
        console.log("Error occured while trying to solve prompt  injection in the request  ", e)
        return res.json({ msg: "Ta maman mola !" })
    }
})

module.exports = router
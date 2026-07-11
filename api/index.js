const express = require("express")
const Agent = require("./Agent")
const app = express()
const PORT = process.env.PORT || 3002

app.post('/agent', async (req, res) => {
    const { prompt } = req.body
    if (!prompt) return res.json({ error: true, msg: "Please provide the user prompt !" })
    const response = await Agent(prompt)
    res.json({ error: false, response, msg: "Responded by AI Lab powered by Felix Warano" })
})

app.listen(PORT, () => console.log(`AI Lab listening on http://localhost:${PORT}`))
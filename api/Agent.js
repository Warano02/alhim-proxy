require("dotenv").config()
const Groq = require("groq-sdk")
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const agent = new Groq({ apiKey: process.env.GROQ_TOKEN })
const context = require("./context")
const { systemPrompt, businessContext } = require("./prompt")

async function Warano(m) {
    let attempts = 0
    while (attempts < 5) {
        try {
            const response = await agent.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "system",
                        content: businessContext,
                    },
                    {
                        role: "user",
                        content: m
                    }
                ],
                model: "openai/gpt-oss-safeguard-20b",
            });

            return response.choices[0]?.message?.content || "reply"
        } catch (e) {
            await sleep(2000)
            attempts++
            console.log("Error in ResponseType:", e);
        }
    }
    return ""
}
module.exports = Warano
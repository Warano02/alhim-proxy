const Groq = require("groq-sdk");
const policy = require("./policy");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function Filter(text) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: policy(text),
            },
            {
                role: "user",
                content: text,
            }
        ],
        model: "openai/gpt-oss-safeguard-20b",
    });

    console.log(chatCompletion.choices[0]?.message?.content || "");
    return chatCompletion.choices[0]?.message?.content || { violation: 0 }
}


module.exports = Filter
const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function getResponse(prompt) {
  const response = await await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{"role": "user", "content": prompt}],
    max_tokens: 150,
  });
  // console.table(response.choices[0].message.content);
  return response.choices[0].message.content;
}

module.exports = { getResponse };

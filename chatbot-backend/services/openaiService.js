import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateTitleFromAI = async (firstMessage) => {
  try {
    const prompt = `
      Generate a concise, 3-5 word title for this conversation:
      "${firstMessage}"
      Only give the title without quotes or extra text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 10,
    });

    const title = response.choices[0].message.content.trim();
    return title;
  } catch (err) {
    console.error("Failed to generate conversation title:", err);
    return null;
  }
};

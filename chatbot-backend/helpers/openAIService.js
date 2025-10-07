import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateTitleFromAI = async (firstUserMessage) => {
  try {
    const prompt = `Generate a very short, descriptive title (max 3 words) for this conversation: "${firstUserMessage}"`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 10,
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Failed to generate AI title:", err);
    return "New Chat";
  }
};

export default { generateTitleFromAI }

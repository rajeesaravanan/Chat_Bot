import dotenv from "dotenv"
dotenv.config()


import { OpenAI } from "openai"
import Message from "../models/Messages.js"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const addMessageService = async (text) => {
    const embResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    })

    const embedding = embResp.data[0].embedding
    const message = new Message({ text, embedding })
    await message.save()
    return message
}

export const chatService = async (query, conversationalHistory) => {
    const embResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
    })

    const queryEmbedding = embResp.data[0].embedding

    const results = await Message.aggregate([
        {
            $search: {
                knnBeta: {
                    vector: queryEmbedding,
                    path: "embedding",
                    k: 3,
                }
            }
        }
    ])

    const context = results
       .slice(0,3)
       .map(r => `Source: ${r.source}\nText: ${r.text}`)
       .join("\n\n")

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content:  `
          You are a helpful chatbot. Format answers clearly.
          - Numbered points must each start on a new line.
          - Bullets must start on a new line.
          - Keep text readable and concise.
          - Use context from documents and conversation history.
        `
            },
            ...conversationalHistory,
            {
          role: "user",
          content: `Based on the following context from documents, answer the question\n${context}\nUser query: ${query}`,
        },
        ]
    })


    let answer = completion.choices[0].message.content;

answer = answer
  .replace(/\s*\n*\s*(\d+\.)/g, "\n$1")  
  .replace(/\s*\n*\s*(-)/g, "\n$1");


    return answer
}


export default { addMessageService, chatService }
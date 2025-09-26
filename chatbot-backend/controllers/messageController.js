import dotenv from "dotenv"
dotenv.config()

import { addMessageService, chatService  } from "../services/messageService.js"

let conversationHistory = []

export const addMessageController = async (req, res)=> {
    try{
        const { text } = req.body
        await addMessageService(text)
        res.json({ message: "Message added successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({ error: "Failed to add document"})
    }
}

export const chatController = async (req, res) => {
  try {
    const { query } = req.body;
    conversationHistory.push({ role: "user", content: query });

    const answer = await chatService(query, conversationHistory);

    conversationHistory.push({ role: "assistant", content: answer });
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
}


export default { addMessageController, chatController }
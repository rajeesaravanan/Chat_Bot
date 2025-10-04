import dotenv from "dotenv"
dotenv.config()

import { addMessageService, chatService  } from "../services/messageService.js"
import { saveConversationService } from "../services/conversationService.js"

import jwt from "jsonwebtoken"

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
    let userId = null


    const authHeader = req.headers.authorization
    if( authHeader?.startsWith("Bearer ")){
      try{
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        userId = decoded.userId
      }catch(err){
        console.log("Invalid token, continuing without session")
      }
    }


    conversationHistory.push({ role: "user", content: query });

    const answer = await chatService(query, conversationHistory);

    conversationHistory.push({ role: "assistant", content: answer });

    if(userId){
      await saveConversationService(userId, [
        { role: "user", content: query},
        { role: "assistant", content: answer}
      ])
    }

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI service unavailable, try again later" });
  }
}


export default { addMessageController, chatController }
import dotenv from "dotenv";
dotenv.config();

import { addMessageService, chatService } from "../services/messageService.js";
import { saveConversationService } from "../services/conversationService.js";

import jwt from "jsonwebtoken";

let conversationHistory = [];

export const addMessageController = async (req, res) => {
  try {
    const { text } = req.body;
    await addMessageService(text);
    res.json({ message: "Message added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add document" });
  }
};

export const chatController = async (req, res) => {
  try {
    const { query, conversationId } = req.body;
    let userId = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        console.log("Invalid token, continuing without session");
      }
    }




    conversationHistory.push({ role: "user", content: query });

    const answer = await chatService(query, conversationHistory);

    conversationHistory.push({ role: "assistant", content: answer });

    let newConversationId = null;
    let conversationTitle = "New Chat";

    if (userId) {
      const result = await saveConversationService(
        userId,
        conversationId,
        { role: "user", content: query },
        { role: "assistant", content: answer }
      );

      newConversationId = result.id;
      conversationTitle = result.title || "New Chat";
    }

    // const formattedAnswer = answer.replace(/\n/g, "<br>");

    let formattedAnswer = answer
  .replace(/\s*\n*\s*(\d+\.)/g, "\n$1")   // fix numbered list formatting
  .replace(/\s*\n*\s*(-)/g, "\n$1")       // fix bullet formatting
  .replace(/\n{3,}/g, "\n\n")             // collapse extra line breaks
  .trim();

    res.json({
      answer: formattedAnswer,
      conversationId: newConversationId || conversationId,
      conversationTitle,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "OpenAI service unavailable, try again later" });
  }
};

export default { addMessageController, chatController };

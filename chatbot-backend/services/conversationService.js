import Conversation from "../models/Conversation.js"
import { generateTitleFromAI } from "./openaiService.js"; 

export const saveConversationService = async (userId, conversationId, userMsg, botMsg) => {
  try {
    if (conversationId && typeof conversationId === "string" && conversationId.length === 24) {
      const conv = await Conversation.findById(conversationId);

      if (conv.messages.length === 0) {
        const title = await generateTitleFromAI(userMsg.content);
        conv.title = title || "New Chat";
      }

      conv.messages.push(userMsg, botMsg);
      await conv.save();

      return { id: conv._id, title: conv.title };
    } else {
      const newConversation = new Conversation({
        userId,
        messages: [userMsg, botMsg],
      });

      const title = await generateTitleFromAI(userMsg.content);
      newConversation.title = title || "New Chat";

      await newConversation.save();
      return { id: newConversation._id, title: newConversation.title };
    }


    
  } catch (err) {
    console.error("Failed to save conversation:", err);
    return { id: conversationId || null, title: "New Chat" };
  }
};


export const getConversationService = async (userId) => {
    return Conversation.find({ userId })
    .select("title createdAt updatedAt")
    .sort({ updatedAt: -1 })
}

export const getConversationByIdService = async (userId, id) => {
    return Conversation.findOne({ _id: id, userId: userId })
}

export const createConversationService = async (userId, title = "New Chat") => {
  const existing = await Conversation.findOne({ userId , messages: { $size: 0 }});
  if (existing) {
    return existing; 
  }

  const conversation = new Conversation({ userId, title, messages: [] });
  return conversation.save();
}

export const deleteConversationService = async (userId, id) => {
    return Conversation.findOneAndDelete({ _id: id, userId: userId})
}

export const updateConversationTitleService = async (userId, id, newTitle) => {
  return Conversation.findOneAndUpdate(
    { _id: id, userId }, 
    { title: newTitle , updatedAt: Date.now() },
    { new: true }

  )
}

export default {
    saveConversationService,
    getConversationService,
    getConversationByIdService,
    createConversationService,
    deleteConversationService,
    updateConversationTitleService
}
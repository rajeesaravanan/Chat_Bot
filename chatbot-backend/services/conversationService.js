import Conversation from "../models/Conversation.js"


export const saveConversationService = async (userId, conversationId, userMsg, botMsg) => {
  try {
    if (conversationId && typeof conversationId === "string" && conversationId.length === 24) {
      await Conversation.findByIdAndUpdate(
        conversationId,
        { $push: { messages: [userMsg, botMsg] } },
        { new: true }
      );
    } else {
      const newConversation = new Conversation({
        userId,
        messages: [userMsg, botMsg],
      });
      await newConversation.save();
      return newConversation._id; 
    }
  } catch (err) {
    console.error("Failed to save conversation:", err);
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

export default {
    saveConversationService,
    getConversationService,
    getConversationByIdService,
    createConversationService,
    deleteConversationService 
}
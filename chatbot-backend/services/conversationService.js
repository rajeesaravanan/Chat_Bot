import Conversation from "../models/Conversation.js"

export const saveConversationService = async (userId, messages)=>{
    return Conversation.findOneAndUpdate(
        { userId },
        { $push: {messages: { $each: messages }}},
        { upsert: true, new: true }
    )
}

export default saveConversationService
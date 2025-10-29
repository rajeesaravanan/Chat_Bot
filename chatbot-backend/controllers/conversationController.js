import {
  getConversationService,
  getConversationByIdService,
  createConversationService,
  deleteConversationService,
  updateConversationTitleService
} from "../services/conversationService.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await getConversationService(req.userId);
    res.json({ conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};


export const getConversationById = async (req, res) => {
  try {
    const convo = await getConversationByIdService(req.userId, req.params.id);
    if (!convo) return res.status(404).json({ error: "Conversation not found" });
    res.json({ conversation: convo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};


export const createConversation = async (req, res) => {
  try {
    const convo = await createConversationService(req.userId);
    res.json({ message: "Temporary conversation created", conversation: convo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
};



export const deleteConversation = async (req, res) => {
  try {
    const result = await deleteConversationService(req.userId, req.params.id);
    if (!result) return res.status(404).json({ error: "Conversation not found" });
    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};


export const updateConversationTitle = async (req, res) => {
  try {
    const { newTitle } = req.body 
    if(!newTitle || newTitle.trim() === "" ){
      return res.status(400).json({ error: "New title is required"})
    }

    const updated = await updateConversationTitleService(req.userId, req.params.id, newTitle)
    if(!updated) return res.status(404).json({ error: "Conversation not found"})

      res.json({ message: " Conversation renamed successfully", conversation: updated})
  }catch(err){
    console.error(err)
    res.status(500).json({error: 'Failed to update conversation title'})
  }
   
}


export default { 
    getConversations,
    getConversationById,
    createConversation,
    deleteConversation,
    updateConversationTitle
}
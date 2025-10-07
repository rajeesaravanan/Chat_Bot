import express from "express";
import {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation
} from "../controllers/conversationController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(authMiddleware); 

router.get("/", verifyToken, getConversations);          
router.get("/:id", verifyToken, getConversationById);    
router.post("/newChat", verifyToken, createConversation);       
router.delete("/:id", verifyToken, deleteConversation); 

export default router;

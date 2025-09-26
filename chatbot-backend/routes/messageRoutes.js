import express from "express";
import { addMessageController, chatController } from "../controllers/messageController.js";

const router = express.Router();

router.post("/add", addMessageController);
router.post("/chat", chatController);

export default router;

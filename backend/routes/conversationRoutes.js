
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

// All conversation routes require authentication
router.use(authMiddleware);

// Create a new conversation
router.post("/", createConversation);

// Get all conversations
router.get("/", getConversations);

// Get one conversation
router.get("/:id", getConversationById);

// Delete one conversation
router.delete("/:id", deleteConversation);

export default router;

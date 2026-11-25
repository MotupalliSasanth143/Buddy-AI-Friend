
import express from "express";

import { sendMessage } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadChatFiles from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Authenticated chat with optional file attachments.
router.post(
  "/send",
  authMiddleware,
  uploadChatFiles,
  sendMessage
);

export default router;

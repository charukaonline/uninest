const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const chatController = require("../controllers/chatController");

// Get all conversations for current user
router.get("/conversations", auth, chatController.getConversations);

// Get messages for a specific conversation
router.get(
  "/conversations/:conversationId/messages",
  auth,
  chatController.getMessages
);

// Send a message
router.post("/messages", auth, chatController.sendMessage);

// Create a new conversation
router.post("/conversations", auth, chatController.createConversation);

// Mark messages as read
router.put(
  "/conversations/:conversationId/read",
  auth,
  chatController.markAsRead
);

module.exports = router;

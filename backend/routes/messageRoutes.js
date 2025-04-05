const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middleware/verifyToken");
const { ensureLandlordAuth } = require("../middleware/ensureLandlordAuth");

// Middleware to check authentication based on the user type
const checkAuth = async (req, res, next) => {
  try {
    // Check for landlord token first
    const landlordToken = req.cookies.landlordToken;
    const userToken = req.cookies.token;
    
    if (landlordToken || userToken) {
      // Use verifyToken middleware which handles both types of tokens
      return await verifyToken(req, res, next);
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};

// All routes require authentication with either user or landlord token
router.use(checkAuth);

// Send a message
router.post("/send", messageController.sendMessage);

// Get conversations
router.get("/conversations", messageController.getConversations);

// Get messages for a conversation
router.get("/conversations/:conversationId", messageController.getMessages);

// Mark message as delivered
router.patch("/delivered/:messageId", messageController.markAsDelivered);

// Mark message as read
router.patch("/read/:messageId", messageController.markAsRead);

module.exports = router;
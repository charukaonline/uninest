const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const { redisClient } = require("../config/redis");

// Function to generate a unique conversation ID
const generateConversationId = (userId1, userId2) => {
  // Sort IDs to ensure consistency
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content, listingId } = req.body;
    const senderId = req.user._id;

    // Validate input
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: "Recipient ID and message content are required",
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }

    // Generate conversation ID
    const conversationId = generateConversationId(senderId, recipientId);

    // Check if conversation exists or create a new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      listingId: listingId || { $exists: true }
    });

    if (!conversation && listingId) {
      // Create new conversation
      conversation = new Conversation({
        participants: [senderId, recipientId],
        listingId,
        unreadCount: { [recipientId.toString()]: 1 }
      });
      await conversation.save();
    } else if (conversation) {
      // Update unread count for recipient
      const currentCount = conversation.unreadCount.get(recipientId.toString()) || 0;
      conversation.unreadCount.set(recipientId.toString(), currentCount + 1);
      await conversation.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "ListingId is required for new conversations",
      });
    }

    // Create new message
    const newMessage = new Message({
      conversationId,
      sender: senderId,
      recipient: recipientId,
      content,
      listingId: listingId || undefined,
      status: "sent"
    });

    await newMessage.save();

    // Store in Redis for real-time delivery status (expire after 24 hours)
    await redisClient.set(
      `message:${newMessage._id}`,
      JSON.stringify({ status: "sent", timestamp: Date.now() }),
      "EX",
      86400
    );

    // Update conversation with last message
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message
    });
  }
};

// Get conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id; // This now works for both user types

    console.log("Fetching conversations for user ID:", userId);

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "username email role")
      .populate("listingId", "propertyName images")
      .populate({
        path: "lastMessage",
        select: "content status createdAt"
      })
      .sort({ updatedAt: -1 });

    console.log(`Found ${conversations.length} conversations`);
    
    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message
    });
  }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Find the conversation to verify user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this conversation"
      });
    }

    // Fetch messages
    const messages = await Message.find({
      conversationId: generateConversationId(conversation.participants[0], conversation.participants[1])
    })
      .sort({ createdAt: 1 });

    // Mark messages as read
    const unreadMessages = messages.filter(
      msg => msg.recipient.toString() === userId.toString() && msg.status !== "read"
    );

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg._id);
      
      await Message.updateMany(
        { _id: { $in: messageIds } },
        {
          $set: {
            status: "read",
            readAt: new Date()
          }
        }
      );

      // Reset unread count for this user
      conversation.unreadCount.set(userId.toString(), 0);
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message
    });
  }
};

// Mark message as delivered
exports.markAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // Update in Redis
    await redisClient.set(
      `message:${messageId}`,
      JSON.stringify({ status: "delivered", timestamp: Date.now() }),
      "EX",
      86400
    );
    
    // Update in MongoDB
    await Message.findByIdAndUpdate(messageId, { status: "delivered" });
    
    res.status(200).json({
      success: true,
      message: "Message marked as delivered"
    });
  } catch (error) {
    console.error("Mark as delivered error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
      error: error.message
    });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }
    
    // Check if user is the recipient
    if (message.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to mark this message as read"
      });
    }
    
    // Update message status
    message.status = "read";
    message.readAt = new Date();
    await message.save();
    
    // Clear from Redis
    await redisClient.del(`message:${messageId}`);
    
    // Update conversation unread count
    const conversation = await Conversation.findOne({
      participants: { $all: [message.sender, message.recipient] }
    });
    
    if (conversation) {
      const currentCount = conversation.unreadCount.get(userId.toString()) || 0;
      if (currentCount > 0) {
        conversation.unreadCount.set(userId.toString(), currentCount - 1);
        await conversation.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: "Message marked as read"
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
      error: error.message
    });
  }
};
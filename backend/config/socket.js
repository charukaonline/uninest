const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { updateCachedMessageStatus } = require("./redis");

let io;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const userType = socket.handshake.auth.userType;

      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      socket.userType = userType;
      socket.join(user._id.toString());
      next();
    } catch (error) {
      next(new Error("Authentication error: " + error.message));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Handle message delivery status
    socket.on("message_delivered", async ({ messageId }) => {
      try {
        // Update message status in Redis to "delivered"
        const updated = await updateCachedMessageStatus(messageId, "delivered");

        // If message wasn't in Redis, update in MongoDB
        if (!updated) {
          const Message = require("../models/Message");
          await Message.findByIdAndUpdate(messageId, { status: "delivered" });
        }

        // Get message details to notify sender
        const Message = require("../models/Message");
        const message = await Message.findById(messageId);

        if (message) {
          // Notify the sender that message was delivered
          io.to(message.sender.toString()).emit("message_status_update", {
            messageId,
            status: "delivered",
          });
        }
      } catch (error) {
        console.error("Error handling message delivery:", error);
      }
    });

    socket.on("typing", async ({ conversationId }) => {
      try {
        // Find the conversation to get other participants
        const Conversation = require("../models/Conversation");
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) return;

        // Notify other participants that this user is typing
        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== socket.user._id.toString()) {
            io.to(participantId.toString()).emit("user_typing", {
              conversationId,
              userId: socket.user._id,
              username: socket.user.username,
            });
          }
        });
      } catch (error) {
        console.error("Error handling typing event:", error);
      }
    });

    socket.on("stop_typing", async ({ conversationId }) => {
      try {
        // Find the conversation to get other participants
        const Conversation = require("../models/Conversation");
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) return;

        // Notify other participants that this user stopped typing
        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== socket.user._id.toString()) {
            io.to(participantId.toString()).emit("user_stopped_typing", {
              conversationId,
              userId: socket.user._id,
            });
          }
        });
      } catch (error) {
        console.error("Error handling stop typing event:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = { initializeSocket, getIO };

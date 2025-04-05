const socketio = require('socket.io');
const { redisClient } = require('./redis');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require('../models/Message');

let io;

const initializeSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: " + error.message));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Join a user-specific room for direct messages
    socket.on('joinUserRoom', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      }
    });

    // Listen for new messages
    socket.on('sendMessage', async (messageData) => {
      try {
        // Update message status to delivered when received by server
        if (messageData._id) {
          await redisClient.set(
            `message:${messageData._id}`,
            JSON.stringify({ status: 'delivered', timestamp: Date.now() }),
            "EX",
            86400
          );

          await Message.findByIdAndUpdate(messageData._id, { status: 'delivered' });

          // Notify the sender that the message has been delivered
          io.to(`user:${messageData.sender}`).emit('messageDelivered', {
            messageId: messageData._id,
            conversationId: messageData.conversationId
          });

          // Send the message to the recipient
          io.to(`user:${messageData.recipient}`).emit('newMessage', messageData);
        }
      } catch (error) {
        console.error('Socket error:', error);
      }
    });

    // Listen for message read events
    socket.on('messageRead', async (data) => {
      try {
        const { messageId, userId } = data;

        if (messageId && userId) {
          // Notify the sender that their message has been read
          const message = await Message.findById(messageId);

          if (message && message.sender.toString() !== userId) {
            message.status = 'read';
            message.readAt = new Date();
            await message.save();

            // Clear from Redis
            await redisClient.del(`message:${messageId}`);

            io.to(`user:${message.sender}`).emit('messageRead', {
              messageId,
              conversationId: message.conversationId
            });
          }
        }
      } catch (error) {
        console.error('Socket message read error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};

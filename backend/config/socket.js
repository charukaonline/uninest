const socketIO = require("socket.io");
const redisClient = require("./redis");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
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

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

    // Join user's personal room
    socket.join(socket.user._id.toString());

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

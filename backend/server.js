// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("./config/passport");
const { ensureUploadsDirectory } = require("./config/init");
const cookieParser = require("cookie-parser");
const session = require("express-session"); // Added session import
const adminRoutes = require("./routes/admin");
const listingRoutes = require("./routes/listingRoutes");
const reviewRoutes = require("./routes/review");
const preferenceRoutes = require("./routes/preference");
const notificationRoutes = require("./routes/notificationRoutes");
const http = require("http");
const { initializeSocket } = require("./config/socket");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser to handle form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Parse cookies
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());

// Ensure uploads directory exists
ensureUploadsDirectory();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// MongoDB Connection and Server Start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    server
      .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}`);
          server.listen(PORT + 1, () => {
            console.log(`Server is running on port ${PORT + 1}`);
          });
        } else {
          console.error("Server error:", err);
        }
      });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

// Schedule job to check for expiring subscriptions (runs daily at 8:00 AM)
const cron = require("node-cron");
const {
  checkExpiringSubscriptions,
} = require("./controllers/subscriptionController");

cron.schedule("0 8 * * *", async () => {
  console.log(
    "Running scheduled job: checking expiring and expired subscriptions"
  );
  try {
    const result = await checkExpiringSubscriptions();
    console.log("Subscription check completed:", result);
  } catch (error) {
    console.error("Error in subscription check job:", error);
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to UniNest Backend!");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", adminRoutes);
app.use("/api/send-email", require("./routes/inquiry"));
app.use("/api/listings", listingRoutes);
app.use("/api/university", require("./routes/university"));
app.use("/api/review", reviewRoutes);
app.use("/api/search", require("./routes/search"));
app.use("/api/preferences", preferenceRoutes);
app.use("/api/bookmark", require("./routes/bookmarkRoutes"));
app.use("/api/schedules", require("./routes/scheduleRoutes")); // Changed from schedule to schedules
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", require("./routes/chat"));
app.use("/api/page-status", require("./routes/pageStatus"));
app.use("/api/report", require("./routes/listingReportRoutes")); // Added report route
app.use("/api/subscription", subscriptionRoutes);

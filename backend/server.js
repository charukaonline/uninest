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

// MongoDB Connection and Server Start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app
      .listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}`);
          app.listen(PORT + 1, () => {
            console.log(`Server is running on http://localhost:${PORT + 1}`);
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

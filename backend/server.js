const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("./config/passport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Initialize passport
app.use(passport.initialize());

// MongoDB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy. Trying port ${PORT + 1}`);
        app.listen(PORT + 1, () => {
          console.log(`Server is running on http://localhost:${PORT + 1}`);
        });
      } else {
        console.error('Server error:', err);
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

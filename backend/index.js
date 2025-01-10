const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to UniNest Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// test route for listings
// const Listing = require('./models/Listing');

// app.get('/test-add-listing', async (req, res) => {
//   try {
//     const sampleListing = new Listing({
//       title: 'Sample boarding house 654',
//       location: 'Near University',
//       price: 12000,
//       amenities: ['Electricity', 'Water'],
//       distance: 1.2,
//       rating: 4
//     });

//     const savedListing = await sampleListing.save();
//     res.json(savedListing);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save listing' });
//   }
// });

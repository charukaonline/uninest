const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a 2dsphere index for geospatial queries
universitySchema.index({
  "location.coordinates.longitude": 1,
  "location.coordinates.latitude": 1,
});

module.exports = mongoose.model("University", universitySchema);

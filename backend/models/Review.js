const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratings: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    safety: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  review: String,
  images: [
    {
      url: String,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);

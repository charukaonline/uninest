const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: false // Optional, only present for first message in conversation
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

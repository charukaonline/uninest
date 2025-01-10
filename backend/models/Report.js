const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "inappropriate_content",
      "fraudulent_listing",
      "scam",
      "harassment",
      "misleading_info",
      "terms_violation",
      "duplicate_listing",
      "technical_issue",
    ],
    required: true,
  },
  targetType: {
    type: String,
    enum: ["property", "user", "review"],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "targetType",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "investigating", "resolved", "dismissed"],
    default: "pending",
  },
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: Date,
});

module.exports = mongoose.model("Report", reportSchema);

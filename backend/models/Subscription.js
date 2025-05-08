const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  planType: { type: String, enum: ["free", "premium"], default: "free" },
  nextBillingDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "expired"], default: "active" },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);

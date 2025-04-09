const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Landlord",
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);

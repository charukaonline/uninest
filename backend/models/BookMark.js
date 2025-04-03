const mongoose = require("mongoose");

const bookMarkSchema = new mongoose.Schema({
    listingId: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("BookMark", bookMarkSchema);
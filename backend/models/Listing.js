// models/Listing.js
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  propertyName: { type: String, required: true },
  propertyType: { type: String, required: true },
  builtYear: { type: String, required: true },
  size: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  garage: { type: Number },
  monthlyRent: { type: Number, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String },
  nearestUniversity: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  images: [String],
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  eloRating: { type: Number, default: 1400 },
});

module.exports = mongoose.model("Listing", listingSchema);

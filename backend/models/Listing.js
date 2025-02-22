const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  landlordId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyName: { type: String, required: true },
  propertyType: { type: String, required: true },
  builtYear: { type: Number, required: true },
  size: { type: Number, default: 0 },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  garage: { type: Number, default: 0 },
  monthlyRent: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }],
});

module.exports = mongoose.model("Listing", listingSchema);

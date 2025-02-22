const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  propertyName: { type: String, required: true },
  propertyType: { type: String, required: true },
  builtYear: { type: Number, required: true },
  size: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  garage: { type: Number },
  monthlyRent: { type: Number, required: true },
  description: { type: String },
  images: [{ type: String }],
});

module.exports = mongoose.model("Listing", listingSchema);

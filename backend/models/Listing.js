const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    // Landlord Reference
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    landlordEmail: {
      type: String,
      required: true,
    },

    // Step 1 Fields - Property Details
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

    // Step 2 Fields - Location Details
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String },
    nearestUniversity: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    // Additional Metadata
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "inactive"],
      default: "available",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will automatically handle createdAt and updatedAt
  }
);

// Add index for better search performance
listingSchema.index({ city: 1, propertyType: 1 });
listingSchema.index({ coordinates: "2dsphere" }); // For geospatial queries

module.exports = mongoose.model("Listing", listingSchema);

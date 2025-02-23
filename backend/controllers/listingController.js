const s3 = require("../config/awsConfig");
const Listing = require("../models/Listing");
const User = require("../models/User");
const tempStorage = require("../utils/tempStorage");
const fs = require("fs");

exports.addListing = async (req, res) => {
  try {
    const landlordId = req.user?.id;

    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No landlord ID found",
      });
    }

    // Get landlord email
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    const parseNumber = (value) => {
      if (value === undefined || value === "") return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Handle file uploads directly to S3
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `listings/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };
        return s3.upload(params).promise();
      });

      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.Location);
    }

    // Parse coordinates correctly
    const coordinates = {
      latitude: parseFloat(req.body.coordinates?.latitude) || 0,
      longitude: parseFloat(req.body.coordinates?.longitude) || 0
    };

    // Create new listing
    const newListing = new Listing({
      landlordId,
      landlordEmail: landlord.email,
      propertyName: req.body.propertyName,
      propertyType: req.body.propertyType,
      builtYear: parseNumber(req.body.builtYear),
      size: parseNumber(req.body.size),
      bedrooms: parseNumber(req.body.bedrooms),
      bathrooms: parseNumber(req.body.bathrooms),
      garage: parseNumber(req.body.garage),
      monthlyRent: parseNumber(req.body.monthlyRent),
      description: req.body.description || "",
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      postalCode: req.body.postalCode,
      nearestUniversity: req.body.nearestUniversity,
      coordinates: coordinates,
      images: imageUrls,
      status: "available",
    });

    await newListing.save();

    res.status(201).json({
      success: true,
      message: "Listing added successfully",
      listing: newListing,
    });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
